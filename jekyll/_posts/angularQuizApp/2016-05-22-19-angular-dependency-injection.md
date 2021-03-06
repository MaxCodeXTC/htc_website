---
title: AngularJS Quiz App Tutorial Part 19 – More Dependency Injection
date: 2016-05-22T20:15:37+00:00
author: Adrian
layout: post-sidebar
alias: /code-projects/angular-quiz-app/19-angular-dependency-injection/
head-title: Part 19 AngularJS Quiz App Tutorial
image: https://firebasestorage.googleapis.com/v0/b/hungry-turtle-code.appspot.com/o/article_images%2FAngular-quiz-part-19_f7ugae.jpg?alt=media&token=d824b20e-e6a5-43eb-b3af-9e7b00ced4e5
excerpt: First Steps To Getting The Results We have finished the quiz controller so now it is time to start the results controller. In the last part we created a property called resultsActive, which is what we will use to trigger …

videoID: N6N3KhkKk3o
repo: HungryTurtleCode/TurtleFactQuiz
demo: turtlefacts
fbimg: /assets/ng-quiz-app-fb.jpg
twitterimg: /assets/ng-quiz-app-twitter.jpg
course-index: angular-quiz
series: Basic Angular Quiz App
loop: false

categories:
  - Projects
tags:
  - AngularJS
  - Basic Angular Quiz App
  - Javascript
resources:
  - name: Angular Docs
    link: https://docs.angularjs.org/api
---
## First Steps To Getting The Results

We have finished the quiz controller so now it is time to start the results controller. In the [last part]({{site.baseurl}}/projects/18-marking-the-quiz/) we created a property called resultsActive, which is what we will use to trigger the results area to show using an ng-show. We will also delve into some more angular dependency injection.

**If you want to see the app for yourself,** [check it out here]({{site.baseurl}}/demos/turtlefacts){: target="_blank"}<!--_-->

The git repo [can be found here](https://github.com/adiman9/HungryTurtleFactQuiz){: target="_blank"}<!--_-->.

[The next part can be found here]({{site.baseurl}}/projects/20-familiar-bootstrap/)

Before we can start showing the results area we need to create it. So in the HTML, under the quiz controller markup let’s create a new div with a new [ng-controller directive](https://docs.angularjs.org/api/ng/directive/ngController){: target="_blank"}<!--_-->. Again using the &#8220;controller as&#8221; syntax.

{% highlight html linenos%}
<div ng-controller="resultsCtrl as results">
  <!-- results controller markup -->
</div>
{% endhighlight %}

Now the controller itself needs to be created. So create a new file called results.js inside the controllers directory. The script will be started with an [IIFE](http://stackoverflow.com/questions/8228281/what-is-the-function-construct-in-javascript){: target="_blank"}<!--_--> as using and the rest should also look familiar to you by now.

{% highlight javascript linenos%}
(function(){

  angular
    .module("turtleFacts")
    .controller("resultsCtrl", ResultsController);

  function ResultsController(quizMetrics, DataService){
    var vm = this;
  }

})();
{% endhighlight %}

### More Angular Dependency Injection

I mentioned that we will change the visibility of the results controller markup depending on the value of the resultsActive property on the quizMetrics factory object. This means that we need access to that factory from inside the results controller &#8211; this means dependency injection!

{% highlight javascript linenos%}
ResultsController.$inject = ['quizMetrics', 'DataService'];

function ResultsController(quizMetrics, DataService){
  // Code for results controller here
}
{% endhighlight %}

Also don’t forget to add the script tag to the bottom of the html page.

{% highlight html linenos%}
<!-- Our application scripts -->
<script src="js/app.js"></script>
<script src="js/controllers/list.js"></script>
<script src="js/controllers/quiz.js"></script>
<script src="js/controllers/results.js"></script>
<script src="js/factories/quizMetrics.js"></script>
<script src="js/factories/dataservice.js"></script>
{% endhighlight %}

With the quizMetrics injected into the results controller we can use the ng-show directive to display the results markup.

{% highlight html linenos%}
<div ng-controller="resultsCtrl as results" ng-show="results.quizMetrics.resultsActive">
</div>
{% endhighlight %}

### A Bit Of A Problem

If you now run through the application you will see that when the user clicks yes on the prompt at the end of the quiz, the list controller shows again. This is because we only hide the list controller when quizActive is true. But when the yes button is clicked in that prompt is sets quizActive back to false and resultsActive to true. So the list controller shows with the restults controller below it.

We need to amend this by changing the ng-hide on the list controller to hide when either the quiz controller or the results controller is active.

{% highlight html linenos%}
<div ng-controller="listCtrl as list" ng-hide="list.quizMetrics.quizActive || list.quizMetrics.resultsActive">

</div>
{% endhighlight %}

### On To The Next One, On To The Next One&#8230;

With that done, we now have the results controller showing when it should be. The [next step]({{site.baseurl}}/projects/20-familiar-bootstrap/) from here is to start populating the results controller with some content. That is what we will do in the [next part]({{site.baseurl}}/projects/20-familiar-bootstrap/)

See you in [part 20]({{site.baseurl}}/projects/20-familiar-bootstrap/)

Adrian

&nbsp;

Please give this post a share if you enjoyed it. _Everyone_ needs that **awesome friend** to send them amazing stuff.
