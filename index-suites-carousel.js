    class InfiniteSlider {
      constructor() {
        this.slider = document.getElementById('slider');
        this.items = [
          { title: 'Standard Chamber', img: 'slider/Standard.jpg' },
          { title: 'Grand Chamber', img: 'slider/Grand.jpg' },
          { title: 'Salon Suite', img: 'slider/Salon.webp' },
          { title: 'Legacy Suite', img: 'slider/Legacy.avif' },
          { title: 'Executive Suite', img: 'slider/Executive.avif' }, 
          { title: 'Penthouse Estate', img: 'slider/Penthouse.webp' }

        ];

        this.cloneCount = 3;
        this.currentIndex = 0;
        this.isAnimating = false;
        this.itemWidth = 0;
        this.visibleItems = 0;
        this.marginRight = 24; 

        this.init();
        this.addEventListeners();
      }

      init() {
        this.createClones();
        this.createOriginalItems();
        this.updateMetrics();
        this.centerSlider();
      }

      createClones() {
        // Create leading clones
        for(let i = 0; i < this.cloneCount; i++) {
          this.items.forEach(item => this.createSlide(item, 'lead-clone'));
        }

        // Create trailing clones
        for(let i = 0; i < this.cloneCount; i++) {
          this.items.forEach(item => this.createSlide(item, 'trail-clone'));
        }
      }

      createOriginalItems() {
        this.items.forEach(item => this.createSlide(item));
      }

      createSlide(item, cloneType = '') {
  const slide = document.createElement('div');
  slide.className = 'slide-item';
  slide.innerHTML = `
    <div class="slide-card position-relative">
      <div class="img-gradient">
        <img src="${item.img}" class="slider-img" alt="${item.title}">
      </div>
      <div class="p-3 position-absolute bottom-0 start-0 end-0">
        <h5 class="text-white">${item.title}</h5>
        <button class="btn btn-carousel mt-2 me-2 px-4 fw-small rounded-pill">料金表示</button>
        <button class="btn btn-sec-carousel mt-2 px-3 fw-small rounded-pill">詳細を見る</button>
      </div>
    </div>
  `;
  this.slider.appendChild(slide);
}


      updateMetrics() {
        // itemWidth is the width of the item excluding margin
        this.itemWidth = this.slider.children[0]?.offsetWidth || 0;
        // visibleItems calculation might need adjustment if you want to count based on total space
        // For now, keeping it based on itemWidth without margin
        this.visibleItems = Math.floor(this.slider.parentElement.offsetWidth / (this.itemWidth + this.marginRight));
      }

      centerSlider() {
        // Start at the beginning of the original items
        this.currentIndex = this.items.length * this.cloneCount;
        // Adjust transform to account for item width + margin
        this.slider.style.transform = `translateX(-${this.currentIndex * (this.itemWidth + this.marginRight)}px)`;
      }

      navigate(direction) {
        if (this.isAnimating) return;

        this.isAnimating = true;
        this.currentIndex += direction === 'next' ? 1 : -1;

        // Transition duration is already 1s in CSS, but good to ensure here too if needed
        this.slider.style.transition = 'transform 1s cubic-bezier(0.4, 0, 0.2, 1)';
        // Adjust transform to account for item width + margin
        this.slider.style.transform = `translateX(-${this.currentIndex * (this.itemWidth + this.marginRight)}px)`;

        this.slider.addEventListener('transitionend', () => {
          this.isAnimating = false;
          this.checkBoundaries();
        }, { once: true });
      }

      checkBoundaries() {
        const originalItemsStartIndex = this.items.length * this.cloneCount;
        const originalItemsEndIndex = originalItemsStartIndex + this.items.length - 1;

        // Check if we have moved into the trailing clones
        if (this.currentIndex >= originalItemsEndIndex + 1) {
          // Calculate the corresponding index in the original items
          this.currentIndex = originalItemsStartIndex + (this.currentIndex - (originalItemsEndIndex + 1));
          this.jumpToPosition();
        }
        // Check if we have moved into the leading clones
        else if (this.currentIndex < originalItemsStartIndex) {
           // Calculate the corresponding index in the original items
           this.currentIndex = originalItemsEndIndex - (originalItemsStartIndex - this.currentIndex) + 1;
           this.jumpToPosition();
        }
      }

      jumpToPosition() {
        this.slider.style.transition = 'none';
        // Adjust transform to account for item width + margin
        this.slider.style.transform = `translateX(-${this.currentIndex * (this.itemWidth + this.marginRight)}px)`;
        void this.slider.offsetHeight; // Trigger reflow
      }

      addEventListeners() {
        document.querySelector('.next').addEventListener('click', () => this.navigate('next'));
        document.querySelector('.prev').addEventListener('click', () => this.navigate('prev'));

        window.addEventListener('resize', () => {
          this.updateMetrics();
          this.jumpToPosition();
        });

        // Touch handling
        let touchStartX = 0;
        this.slider.addEventListener('touchstart', e => {
          touchStartX = e.touches[0].clientX;
        }, { passive: true });

        this.slider.addEventListener('touchend', e => {
          const touchEndX = e.changedTouches[0].clientX;
          if (Math.abs(touchEndX - touchStartX) > 50) {
            touchEndX < touchStartX ? this.navigate('next') : this.navigate('prev');
          }
        }, { passive: true });
      }
    }

    // Initialize slider
    new InfiniteSlider();
