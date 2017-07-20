class TrackingPixelsController{
  constructor(userData, pixelService) {
    this.pixelService = pixelService;

    this.email = '';

    userData.getUserMeta()
      .then(meta => {
        if(meta && meta.email)
          this.email = meta.email;
      });
  }
  $onInit(){
    this.pixelService.googleAnalytics(0);
    this.pixelService.facebookPixel(45000);
    this.pixelService.activeCampaign(10000);
  }
}

TrackingPixelsController.$inject = ['userData', 'pixelService'];

export default TrackingPixelsController;


