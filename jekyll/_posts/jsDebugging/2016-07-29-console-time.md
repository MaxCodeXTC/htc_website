---
title: Console.time() – Javascript Debugging Tips
date: 2016-07-29T14:08:37+00:00
author: Adrian
layout: post-sidebar
alias: /tips-tricks/console-time/
image: https://firebasestorage.googleapis.com/v0/b/hungry-turtle-code.appspot.com/o/article_images%2Fconsole.time.jpg?alt=media&token=927e21eb-44ab-42e8-964b-8d0f8e4f3689
excerpt: Just In Time – Console.time I have seen some amazing ways of timing how long javascript code takes to run. Taking timestamps and comparing them is a common way. But console.time is method in the console API that allows you …
course-index: js-debugging
videoID: h807oIC66BY
categories:
  - Tutorials
tags:
  - Javascript
  - Debugging
---
## Just In Time &#8211; Console.time

I have seen some amazing ways of timing how long javascript code takes to run. Taking timestamps and comparing them is a common way. But console.time is method in the console API that allows you to do exactly that with not other hassle.

This isn&#8217;t the first Javascript debugging tip I have given. You can check out [console.table]({{site.baseurl}}/tutorials/console-log-table/){: target="_blank"}<!--_--> and [console.trace]({{site.baseurl}}/tutorials/console-trace/){: target="_blank"}<!--_-->, if you haven&#8217;t already.

Starting off, here is the very boring HTML that I started with.

{% highlight html linenos %}
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
  <title>Console.Time</title>
</head>
<body>
  <h1>Experimenting With console.time()</h1>
  
  <script src="script.js"></script>

</body>
</html>
{% endhighlight %}

## Let&#8217;s Take Our Time

If we want to time how long a bit of code takes to run, we will probably want some code that takes a bit of time to run in the first place. No point timing how long it takes to add two numbers together.

Conditionals take a bit of time to compute, so let&#8217;s have loads of them! We can create a for loop to loop through millions of times and on every loop, check if it is the end of the loop. That should take some time to run.

{% highlight javascript linenos%}
for(var i = 0; i &lt; 100000000; i++){
  if(i == 99999999){

  }
}
{% endhighlight %}

Now that we have that, we can use console.time to actually time how long it takes to run. To do that we need to put a console.time call before the start of the for loop and a console.timeEnd call after the for loop has run.

You can also have many instances of console.time running at any given point. To distinguish between them all, you can give them each a name, which is the argument that console.time and timeEnd each take. We will just call this one &#8220;firstTimer&#8221;.

{% highlight javascript linenos%}

console.time("firstTimer");

for(var i = 0; i &lt; 100000000; i++){
  if(i == 99999999){
	  console.timeEnd("firstTimer");
  }
}

{% endhighlight %}

### Run The Code

If you check the console once this code has been executed you will see this:

![console output]({% asset_path console_time_output %}){: class="alignleft" width="400" height="198"}

It looped through 100 million times and made a conditional check on each one, all in 0.315secs. I find that pretty amazing. Computers eh?

But why stop there? I said that you can have multiple instances of console.time running inside the same code. So let&#8217;s try that.

This time I think I will use setTimeout to &#8220;waste&#8221; some time. I can set it to take a certain amount of time before the next code runs, which will be the console.timeEnd call.

{% highlight javascript linenos%}
console.time("secondTimer");

setTimeout(function(){

  console.timeEnd("secondTimer");

}, 2000);
{% endhighlight %}

Running all this code inside the browser we see this:

![second timer console output]({% asset_path console_time_output2 %}){: class="aligncenter" width="400" height="232"}

The first timer runs the same as it did but then we get the second call to console.time. Notice it too slightly more than the 2000 that we set in the timeout. This will be the overhead of actually calling the functions involved in the code.

## Can You Run Two Console.time&#8217;s Simultaneously?

Of course! Let&#8217;s try it. Let&#8217;s call a third console.time at the same time that we call the second. But put a second setTimeout inside the first one and only end the third console.time when the second timeout completes.

{% highlight javascript linenos%}
console.time("secondTimer");
console.time("thirdTimer");

setTimeout(function(){

  console.timeEnd("secondTimer");

  setTimeout(function(){

	  console.timeEnd("thirdTimer");

  }, 3000);

}, 2000);
{% endhighlight %}

Running this in the browser we get three timer values. The first two are the same as we have seen in the past. Then we also get the third one which is the first timeout of 2000ms plus the second period of 3000ms, totalling 5000ms plus a bit of overhead as before.

![Third timer console output]({% asset_path console_time_output3 %}){: class="aligncenter" width="630" height="388"}

There you go. That is about all there is to say about console.time. Go out and use this in your own projects and make your code a bit more efficient by learning where your bottlenecks are.

Until next time,

Stay hungry and keep coding,

Adrian



**Please tell your friends about this if you found it useful…**
