class FullScreenScroll{

  slides: HTMLElement[]
  current: number
  scrolling: boolean
  timeout: number

  touchThreshold: number

  touchstart: number

   constructor(container: HTMLElement, touchThreshold = 100){
     this.slides = [].slice.call(container.children);
     this.touchThreshold = touchThreshold;
     this.current = 0;
     this.registerEventListeners();
     this.removeScrollBars();

   }


   private registerEventListeners(){
      /* Desktop experience */
      window.addEventListener("DOMMouseScroll", this.mouseWheelHandler.bind(this), false);
      window.addEventListener("mousewheel", this.mouseWheelHandler.bind(this), false);
      window.addEventListener("keydown", this.handleKeyPressed.bind(this), false);

      /* Touch experience*/
      window.addEventListener("touchstart", this.touchStartHandler.bind(this), false);
      window.addEventListener("touchmove", this.touchMoveHandler.bind(this), false)


   }

   private mouseWheelHandler(e: MouseWheelEvent){
    var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
    if( delta <= -1 ){
      this.moveDown();
    }else if(delta >= 1){
      this.moveUp();
    }else{
      if(this.timeout){return;}
      this.timeout = setTimeout(this.moveBack.bind(this), 500);
    }
   }

   public moveDown(){
     console.log("down");

    this.scrolling = true;
    this.current = Math.min(this.current+1, this.slides.length-1);
    this.scrollTo(document.scrollingElement, this.slides[this.current].offsetTop, 2000);
    console.log("down end");

   }

   public moveUp(){
    console.log("up");
    this.scrolling = true;

    this.current = Math.max(this.current-1, 0);
    this.scrollTo(document.scrollingElement, this.slides[this.current].offsetTop, 2000);
    console.log("up end");
   }

   public moveBack(){
     console.log("back");

    this.scrolling = true;
    this.scrollTo(document.scrollingElement, this.slides[this.current].offsetTop, 500);
    this.timeout = null;
    console.log("back end");

   }


   public scrollTo(element: Element, to: number, duration: number) {
    var start = element.scrollTop,
    change = to - start,
    currentTime = 0,
    increment = 20;

    let animateScroll = ()=>{
      currentTime += increment;
      var val = this.easeInOutQuad(currentTime, start, change, duration);
      element.scrollTop = val;
      if(currentTime < duration) {
         requestAnimationFrame(animateScroll.bind(this));
      }else{
        this.scrolling = false;
      }
      };
      animateScroll();
   }

   private touchStartHandler(e: TouchEvent){
     if(this.scrolling){return;}
     this.touchstart = e.touches[0].clientY;
     console.log("touchstart at ", this.touchstart);
   }

   private touchMoveHandler(e: TouchEvent){
     clearTimeout(this.timeout);
     if(this.scrolling){return}
     var touchpos = e.touches[0].clientY;
     console.log("touchstart: ", this.touchstart, " touchpos: ", touchpos);
     if(touchpos - this.touchstart >= this.touchThreshold ){
       this.moveUp();
     }else if(touchpos - this.touchstart <= -this.touchThreshold){
       this.moveDown();
     }else{
       this.timeout = setTimeout(this.moveBack.bind(this), 1000);
     }
   }


   public handleKeyPressed(e: KeyboardEvent){
    if(e.keyCode == 40){
      e.preventDefault();
      this.moveDown();
    }else if(e.keyCode == 38){
      e.preventDefault();
      this.moveUp();
    }
   }


   private easeInOutQuad(t: number, start: number, change: number, duration: number) {
    t /= duration/2;
    if (t < 1) return change/2*t*t + start;
    t--;
    return -change/2 * (t*(t-2) - 1) + start;
   }

   private removeScrollBars(){
     var css = "::-webkit-scrollbar {\
       width: 0px;\
       background: transparent;\
     }\
     ::-moz-scrollbar {\
       width: 0px;\
       background: transparent;\
     }\
     html {\
       overflow: -moz-scrollbars-none;\
     }"

     var style = document.createElement("style");
     style.type="text/css";
     style.innerHTML = css;
     document.head.appendChild(style);

   }


}
