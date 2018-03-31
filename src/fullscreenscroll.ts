class FullScreenScroll{

  slides: HTMLElement[]
  current: number
  scrolling: boolean
  timeout: number

   constructor(container: HTMLElement){
     this.slides = [].slice.call(container.children)
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
    this.scrolling = true;
    this.current = Math.min(this.current+1, this.slides.length-1);
    this.scrollTo(document.scrollingElement, this.slides[this.current].offsetTop, 2000);

   }

   public moveUp(){
    this.scrolling = true;

    this.current = Math.max(this.current-1, 0);
    this.scrollTo(document.scrollingElement, this.slides[this.current].offsetTop, 2000);
   }

   public moveBack(){
    this.scrolling = true;
    this.scrollTo(document.scrollingElement, this.slides[this.current].offsetTop, 500);
    this.timeout = null;
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
