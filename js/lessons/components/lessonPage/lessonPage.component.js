import controller from './lessonPage.controller';

const LessonPage = {
  controller,
  bindings: {
    lessonMetaData: '<',
    lessonData: '<'
  },
  template: `
    <h1 class="lesson-title">{{::$ctrl.lessonMetaData.title}}</h1>
    <h3 class="course-title">{{::$ctrl.lessonMetaData.course}}</h3>
    <div ng-if="$ctrl.lessonData">
      <lesson-video
        video-src="{{$ctrl.videoUrl}}"
        next-video="$ctrl.nextLesson()"
        lesson-complete="$ctrl.lessonComplete()">
      </lesson-video>
      <lesson-content
        article="$ctrl.lessonData.article"
        resources="$ctrl.lessonData.resources"
        next-lesson="$ctrl.nextLesson()"
        lesson-is-complete="$ctrl.lessonService.isLessonComplete($ctrl.lessonData.lesson)"
        lesson-complete="$ctrl.lessonComplete()">
      </lesson-content>
    </div>
    <div ng-if="!$ctrl.lessonData">
      <htc-sign-in></htc-sign-in>
    </div>
  `
};

export default LessonPage;
