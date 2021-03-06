---
title: Writing an NPM Library (Parallax Provider)
image: https://firebasestorage.googleapis.com/v0/b/hungry-turtle-code.appspot.com/o/article_images%2FMaking%20a%20Parallax%20Library%20For%20NPM.jpg?alt=media&token=d3a26bcb-4b2c-47ce-a624-cd2a960b73d4
excerpt: In this tutorial we will take the hacky parallax code we wrote before and turn it into a nice generalised library that can be used to implement arbitrary parallax website. Ultimately we will publish the library to NPM.

videoID: DFa5uQwxUcc
repo: adiman9/ParallaxProvider
fbimg: 
twitterimg: 
course-index: parallax-library
series: Parallax Library
demo: parallaxbasic

categories:
  - Projects
tags:
  - Javascript
  - Make a Library
  - Open Source
  - Parallax Library
---
## Let's write a library

[In the previous part]({{site.baseurl}}/projects/parallax-mountains) I wrote some pretty hacky code to get a parallax effect going. In this part I will rebuild that idea into a generalised library that anyone can use to build similar effects easily. In the coming parts we will publish the library on NPM for the world to actually use.

I think this is a good illustration for how typical open source projects come into being. It starts off with someone who has an idea for something they think is cool or something they think will help people out, then they create a super hacky prototype to flesh out the idea a little. Once they have something they think might work then they will start converting it into cleaner code in the format or a library.

## What were the problems

What were the problems we faced in the previous part? What made the code so hacky?

### Issue 1
One of which was that we were constantly converting a global scroll offset a value that was normalised against the position of the current section. For example we had the
{% ihighlight javascript %}{% raw %}
WORD_SPLIT_END
{% endraw %}{% endihighlight %} constant which would define the end of the word split section and the start of the scrolling section. Inside the scrolling section we would normalise the offset for the scrolling section like this:

{% highlight javascript linenos%}{% raw %}
const offset = yoff - WORD_SPLIT_END;
{% endraw %}{% endhighlight %}

That results in offset being 0 at the exact point that the scrolling section comes into view. So the offset here will always refer to how far we have scrolled into the "scrolling" section of the page.

### Issue 2
The second issue was separation of concerns. Ideally we would like to think about the logic for each "section" completely separately. But instead we had to mix the logic for each section up with each other.

The root cause of this issue is that there are 3 phases that can exist in the life-cycle of a "section":
* Phase 1: Before we reach the section.
* Phase 2: While we are scrolling through the section.
* Phase 3: When the scroll has past the section.

But we were handling this using just if statements checking if we were past the end of each section.

That means that the logic for phase 1 - before the section - has to go in the previous conditional block, logic for phase 2 - inside the section's conditional and phase 3 logic in the conditional block afterwards. And herein lies the spaghetti and mixing of concerns.

Here is an example to illustrate what I am talking about:

{% highlight javascript linenos%}{% raw %}
const yoff = window.pageYOffset;
const END_OF_SECTION_ONE = 500;
const END_OF_SECTION_TWO = 1200;
const END_OF_SECTION_THREE = 2000;

if (yoff < END_OF_SECTION_ONE) {
  // Things we have to handle here:
  //     - Section 1: Phase 2
  //     - Section 2: Phase 1
} else if (yoff < END_OF_SECTION_TWO) {
  // Things we have to handle here:
  //     - Section 1: Phase 3
  //     - Section 2: Phase 2
  //     - Section 3: Phase 1
} else if (yoff < END_OF_SECTION_THREE) {
  // Things we have to handle here:
  //     - Section 2: Phase 3
  //     - Section 3: Phase 2
}
{% endraw %}{% endhighlight %}

See how mixed up this is?

## The solution
I think it would cool if each section had it's own "controller" function that gets passed in the offset relative to that section's mount point and the duration of the section (these will be defined in configuration somewhere). Then in that controller you can define a conditional block that checks:

* If offset is less than zero - we are before the section and therefore in Phase 1.
* If offset is greater than zero but less than duration - we are inside the section and therefor Phase 2.
* If offset is greater than duration - we have past the section and therefore Phase 3.

{% highlight javascript linenos%}{% raw %}
function sectionCtrl(offset, duration) {
  if (offset < 0) {
    // Phase 1
  } else if (offset < duration) {
    // Phase 2
  } else {
    // Phase 3
  }
}
{% endraw %}{% endhighlight %}

If each section has it's own controller that deals with this then we have beautifully handled both of our issues. Issue one is no longer because the library will pass in the normalised offset and relieve us from having to calculate it manually and issue two is no longer because each section has a dedicated controller - no more mixing of concerns.

### How will the library know where the section is?

This leads us to the configuration of the web page we are making.

My idea is this - each section will be defined using an object like follows:

{% highlight javascript linenos%}{% raw %}
const section = {
  mountPoint: 500,
  duration: 460,
  controller: sectionCtrl,
}
{% endraw %}{% endhighlight %}

Where each option is:
* **mountPoint**: the pixel offset that this section is mounted
* **duration**: the amount of pixels of scroll this section will last
* **controller**: a reference to a function that will be called as the section controller

We will then pass an array of these section configuration objects into the library when we instantiate it and we have a functional page!

{% highlight javascript linenos%}{% raw %}
const p = new ParallaxProvider([
    {
      mountPoint: 0,
      duration: 500,
      controller: sectionCtrl,
    },
    {
      mountPoint: 500,
      duration: 1200,
      controller: sectionTwoCtrl,
    },
    {
      mountPoint: 1300,
      duration: 500,
      controller: sectionThreeCtrl,
]);
{% endraw %}{% endhighlight %}

## Enough design, let's build something

We now have a pretty solid idea of how we want this library to function. Let's create it!

***Note:** If you are familiar with Rollup, babel and other transpilation and bundling tools then feel free to skip to the heading "Some actual code"*{: ***}

First things first, we need to set up the project directory and the tools we are going to need to start developing. We are ultimately going to publish this library to NPM so we are going to need to use modern tooling to allow us to write modern javascript and  ship the code in a way that allows people to consume it in many ways.

This means we will be using babel to transpile our modern javascript code into code that can be run in older browsers and environments. We will also need a way to produce code into "modules". We want our code to run in the browser if someone puts a script tag in that links to our library but we also want someone to be able to to use modern javascript importing  like this: 

{% highlight javascript %}{% raw %}
import ParallaxProvider from 'ParallaxProvider';
{% endraw %}{% endhighlight %}

To achieve this end we will use a tool called Rollup. Rollup will allow use to bundle our code up into these different module formats automatically. I'm not going to dive deeply into what rollup is, that is a topic for another full tutorial, but I will briefly explain what you need to get going.

### Creating the project

Create a new directly where you are going to put the library. Then inside that directory run

{% highlight bash linenos%}{% raw %}
yarn init -y
{% endraw %}{% endhighlight %}

to create a new package.json then install the dependencies you need with:

{% highlight bash linenos%}{% raw %}
yarn add --dev @babel/core @babel/cli @babel/preset-env rollup rollup-plugin-babel
{% endraw %}{% endhighlight %}

### Dotfiles and config
With the dependencies installed we will need to create the configuration files for them to run correctly. 

Create a 
{% ihighlight bash %}{% raw %}
.babelrc
{% endraw %}{% endihighlight %} file and insert the following:

{% highlight json linenos%}{% raw %}
{
  "presets": ["@babel/preset-env"],
}
{% endraw %}{% endhighlight %}

Create a 
{% ihighlight bash %}{% raw %}
rollup.config.js
{% endraw %}{% endihighlight %} and insert this:

{% highlight javascript linenos%}{% raw %}
const rollupBabel = require('rollup-plugin-babel')

const LIB_NAME = 'ParallaxProvider';

export default {
  input: 'src/index.js',
  output: [
    {
      name: LIB_NAME,
      file: "dist/parallax-provider.umd.js",
      format: 'umd'
    },
    {
      name: LIB_NAME,
      file: "dist/parallax-provider.cjs.js",
      format: 'cjs'
    },
    {
      name: LIB_NAME,
      file: "dist/parallax-provider.esm.js",
      format: 'es'
    },
  ],
  plugins: [
    rollupBabel({
      exclude: 'node_modules/**',
      babelrc: true,
      runtimeHelpers: false,
    }),
  ]
}
{% endraw %}{% endhighlight %}

This is a base configuration for Rollup. What we are doing here is telling Rollup to take 
{% ihighlight bash %}{% raw %}
src/index.js
{% endraw %}{% endihighlight %} and bundle it up into three different bundles.

* A UMD (Universal Module Definition) module - which will work in the browser
* A commonJS bundle which will work with node
* A ecmascript module bundle which uses the new ecmascript module syntax

All of which will be outputted to the 
{% ihighlight bash %}{% raw %}
dist/
{% endraw %}{% endihighlight %} folder with the filename defined in the config.

We are also using the babel plugin for rollup that will convert that code we write into older versions of javascript that can run on the platforms we want. We tell the plugin to use the config from the .babelrc file we created.

### NPM Scripts
To get rollup running we will add some npm scripts into our package.json. These are the scripts I tend to use:

{% highlight javascript linenos%}{% raw %}
"scripts": {
  // rest of npm scripts
  "build": "rollup -c",
  "dev": "rollup -c -w",
}
{% endraw %}{% endhighlight %}

Now we can run 
{% ihighlight bash %}{% raw %}
yarn dev
{% endraw %}{% endihighlight %} and rollup will spin up and start watching our files for changes and automatically spitting out the transpiled modules.

The last two config files I use are 
{% ihighlight bash %}{% raw %}
.editorconfig
{% endraw %}{% endihighlight %} and 
{% ihighlight bash %}{% raw %}
.gitignore
{% endraw %}{% endihighlight %}. Editor config is a plugin you can add to your editor that will read this config file and will format the code in the same way across editors. This is just handy when you have many people working on the same project, you don't want different editors to format the code differently and cause all kinds of formatting issues. Editor config solves that.

gitignore is the final config file and it is just a file that tells git what files and directories it should ignore in your project. This is an essential file as you will rarely want to commit everything into source control. A directory like 
{% ihighlight bash %}{% raw %}
node_modules/
{% endraw %}{% endihighlight %} you never want to commit so you want to ignore it via the gitignore.

[You can see the editor config I used here](https://github.com/adiman9/ParallaxProvider/blob/master/.editorconfig)

[And the gitignore I used here](https://github.com/adiman9/ParallaxProvider/blob/master/.gitignore)

This leaves our final file structure looking something like this:

{% highlight bash linenos%}{% raw %}
src/
  - index.js
.editorconfig
.babelrc
.gitignore
package.json
rollup.config.js
{% endraw %}{% endhighlight %}

With that done, let's write some actual library code.

## Some actual code

We know we want to have a class that accepts an array as input so let's create that now in our
{% ihighlight bash %}{% raw %}
src/index.js
{% endraw %}{% endihighlight %}.

{% highlight javascript linenos%}{% raw %}
export default class ParallaxProvider {
  constructor(modules) {
    if (modules && modules.length) {
      this.modules = modules;
    }
  }
}
{% endraw %}{% endhighlight %}

The next thing we will require is to register a listener to scroll events on the page and inside it grab hold of the
{% ihighlight javascript %}{% raw %}
pageYOffset
{% endraw %}{% endihighlight %}.

{% highlight javascript linenos%}{% raw %}
class ParallaxProvider {
  constructor(modules) {
    if (modules && modules.length) {
      this.modules = modules;
      this.listenToScroll();
    }
  }
  listenToScroll() {
    document.addEventListener('scroll', () => {
      const yoff = window.pageYOffset;
    });
  }
}
{% endraw %}{% endhighlight %}

We should now loop through the modules array and calculate the relative offset for each module and call the controller function, passing in that relative offset and the duration of the module as arguments.

{% highlight javascript linenos%}{% raw %}
listenToScroll() {
  document.addEventListener('scroll', () => {
    const yoff = window.pageYOffset;

    this.modules.forEach(module => {
      const duration = module.duration;
      module.controller(yoff - module.mountPoint, duration);
    });
  });
}
{% endraw %}{% endhighlight %}

The main issue here is that the mountPoint is being treated as an absolute point in the scroll space of the page. However, I would like the mountPoint to be relative to the end of the previous module in the modules array. This will take a bit of calculation, but it will only need to be done once at the start of the app. So let's create an
{% ihighlight javascript %}{% raw %}
init
{% endraw %}{% endihighlight %} function to do those calculations in. We will call the init function in the constructor and we might as well then call the listen to scroll function at the end of the init.

{% highlight javascript  linenos%}{% raw %}
class ParallaxProvider {
  constructor(modules) {
    if (modules && modules.length) {
      this.modules = modules;
      this.init();
    }
  }
  init() {
    // The code to figure out the relative mounting of modules

    this.listenToScroll();
  }
  listenToScroll() {
    // event listener code
  }
}
{% endraw %}{% endhighlight %}

Now, to calculate the place to mount each module, we need to figure out what the absolute point that the previous module ended was and then use the current modules mount point against that value.

This is the code that we will use. Take a look at it then we will talk through it:

{% highlight javascript linenos%}{% raw %}
init() {
  const newModules = [];

  for (let i = 0; i < this.modules.length; i++) {
    const module = this.modules[i];

    const numNewModules = newModules.length;
    const previousModule = numNewModules
      ? newModules[numNewModules - 1]
      : null;

    let endPrevModule = 0;
    if (previousModule) {
      const prevDuration = previousModule.duration;
      endPrevModule = previousModule._absMountPoint + prevDuration;
    }

    const absMountPoint = endPrevModule + module.mountPoint;
    module._absMountPoint = absMountPoint;

    newModules.push(module);
  }

  this.modules = newModules;

  this.listenToScroll();
}
{% endraw %}{% endhighlight %}

Let's talk through this code.

### First loop through the for

So we start by defining a new empty array then loop through the existing modules array.

Then we check if there is anything in the 
{% ihighlight javascript %}{% raw %}
newModules
{% endraw %}{% endihighlight %} array. Obviously in the first loop there won't be anything in it because we have just defined it as being empty. Therefore in the first loop 
{% ihighlight javascript %}{% raw %}
previousModules
{% endraw %}{% endihighlight %} will equal 
{% ihighlight javascript %}{% raw %}
null
{% endraw %}{% endihighlight %}.

That will result in the next if block being skipped and leaving 
{% ihighlight javascript %}{% raw %}
endPrevModule
{% endraw %}{% endihighlight %} equal to 0. This makes sense because there is no previous module because we are dealing with the first element and therefore the mount point should start at 0.

Using this
{% ihighlight javascript %}{% raw %}
endPrevModule
{% endraw %}{% endihighlight %} we calculate the absolute mount point of the current module by adding the current modules mount point to the end of the previous module. In this case because there is no previous module, the mount point will be added to zero. This basically means that whatever mount point is given to the first module will act as an absolute mount point.

Now that we have the absolute mount point calculated, we make that a property on the module itself (we use the convention of prepending an _ to the property name to indicate it is an internal property to the class and shouldn't be accessed from outside).

We then push this module that now has an 
{% ihighlight javascript %}{% raw %}
_absMountPoint
{% endraw %}{% endihighlight %}{: _} property onto the 
{% ihighlight javascript %}{% raw %}
newModules
{% endraw %}{% endihighlight %} array.

### Next loop through
We now have some elements in the
{% ihighlight javascript %}{% raw %}
newModules
{% endraw %}{% endihighlight %} array and therefore
{% ihighlight javascript %}{% raw %}
previousModule
{% endraw %}{% endihighlight %} will be correctly set in the ternary expression.

Now that we have a non null value for 
{% ihighlight javascript %}{% raw %}
previousModule
{% endraw %}{% endihighlight %} we will enter the if block. Inside the if block we grab hold of the duration of the previous module and add it to the 
{% ihighlight javascript %}{% raw %}
_absMountPoint
{% endraw %}{% endihighlight %}{: _} that we calculated in the previous loop.

This takes the absolute mount point of the previous module and adds the duration of the previous module to it. That gives us the point at which the previous module ends. If we are mounting the current module relative to the point the previous module ends then that is exactly the value we want.

This now becomes that value of 
{% ihighlight javascript %}{% raw %}
endPrevModule
{% endraw %}{% endihighlight %} and then that value is again used to calculate the absolute mount point of the current module by adding the current modules mount point to it.

### And so it goes

This process continues until all the modules have been looped through and 
{% ihighlight javascript %}{% raw %}
newModules
{% endraw %}{% endihighlight %} has been fully populated. We then leave the for loop and reassign 
{% ihighlight javascript %}{% raw %}
this.modules
{% endraw %}{% endihighlight %} to the 
{% ihighlight javascript %}{% raw %}
newModules
{% endraw %}{% endihighlight %} variable. This results in 
{% ihighlight javascript %}{% raw %}
this.modules
{% endraw %}{% endihighlight %} having all the absolute mount point values for each module too.

## Using the absolute values

If you remember from above, we in the event listener code we loop through all the modules and call their controllers like this:

{% highlight javascript linenos%}{% raw %}
// Old way of calling the controllers
this.modules.forEach(module => {
  const duration = module.duration;
  module.controller(yoff - module.mountPoint, duration);
});
{% endraw %}{% endhighlight %}

Here we are using 
{% ihighlight javascript %}{% raw %}
yoff - module.mountPoint
{% endraw %}{% endihighlight %} to calculate the relative mount point. As we mentioned, this forced us to have mountPoint be absolute values. But now we have converted the code to use relative values and calculate the absolute mount of each module for us. 

So we can convert the above code to use the newly computed mountPoint like so:

{% highlight javascript linenos%}{% raw %}
this.modules.forEach(module => {
  const duration = module.duration;
  module.controller(yoff - module._absMountPoint, duration);
});
{% endraw %}{% endhighlight %}{: _}

So there you have it! That is a library that solves all the problems we had in the previous part.

For ease, here is all the code from this part:

{% highlight javascript linenos%}{% raw %}
class ParallaxProvider {
  constructor(modules) {
    if (modules && modules.length) {
      this.modules = modules;
      this.init();
    }
  }

  init() {
    const newModules = [];

    for (let i = 0; i < this.modules.length; i++) {
      const module = this.modules[i];

      const numNewModules = newModules.length;
      const previousModule = numNewModules
        ? newModules[numNewModules - 1]
        : null;

      let endPrevModule = 0;
      if (previousModule) {
        const prevDuration = previousModule.duration;
        endPrevModule = previousModule._absMountPoint + prevDuration;
      }

      const absMountPoint = endPrevModule + module.mountPoint;
      module._absMountPoint = absMountPoint;

      newModules.push(module);
    }

    this.modules = newModules;
    
    this.listenToScroll();
  }
  listenToScroll() {
    document.addEventListener('scroll', () => {
      const yoff = window.pageYOffset;

      this.modules.forEach(module => {
        module.controller(yoff - module._absMountPoint, module.duration);
      });
    });
  }
}
{% endraw %}{% endhighlight %}

Obviously there are many more awesome features that could be added to this library and I intend to add some. When I do, I may create further parts to this series to illustrate how I did them. If you have any ideas feel free to [open a pull request](https://github.com/adiman9/ParallaxProvider).

In the next part I will rebuild the previous parts website using this new library (trust me, it will be a quick one :P). Then we will write tests for this library and deploy it to NPM. Deploying it to npm will involve using travis CI for continuous integration and using other tools like rollup, prettier, eslint, husky etc to ensure consistent code for open source contributions.

Stay hungry, and keep coding.

Adrian

&nbsp;

Please give this post a share if you enjoyed it. _Everyone_ needs that **awesome friend** to send them amazing stuff.
