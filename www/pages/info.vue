<script setup>
import gsap from 'gsap'

definePageMeta({
  middleware: [
    function (to, from) {
      const info = toInfo()
      if (from.path === '/') info.value = true
    }
  ],
  pageTransition: {
    css: false,
    name: 'info',
    mode: 'out-in',
    onEnter(el, done) {
      // let intro = gsap.timeline({ paused: true, onComplete: () => done() })
      // intro.to('#i-a', {
      //   opacity: 1,
      //   duration: .6,
      //   ease: 'easeOutQuint',
      // }, '<')
      //   .to('#i-a', {
      //     opacity: 1,
      //     duration: .6,
      //     ease: 'easeOutQuint',
      //   }, '<')
      //
      // intro.play()
      done()
    },
    onLeave(el, done) {
      const { $toHome } = useNuxtApp()
      const info = toInfo()
      const { isMobile } = useDevice();

      info.value = false

      if (isMobile === false) {
        let intro = gsap.timeline({
          paused: true, onComplete: () => {
            $toHome()
            done()
          }
        })
        intro.to('#i-a', {
          opacity: 0,
          duration: .6,
          ease: 'easeOutQuint',
        }, '<')
          .to('#i-a', {
            opacity: 0,
            duration: .6,
            ease: 'easeOutQuint',
          }, '<')

        intro.play()
      } else {
        let intro = gsap.timeline({ paused: true, onComplete: () => done() })
        intro.to('.h-c', { opacity: 0, ease: 'easeOutQuint', duration: .6 }, '<')
        // intro.to('.n', { color: '#ffffff', ease: 'easeOutQuint', duration: .6 }, '<')
        // intro.to([document.body], { color: '#ffffff', background: '#000000', ease: 'easeOutQuint', duration: .6 }, '<')
        intro.play()
      }
    },
  },
})

const dataStore = useData()

onMounted(() => {
  let intro = gsap.timeline({ paused: true, })

  intro.to(
    [document.body],
    {
      background: '#ffffff',
      duration: 1,
      color: '#000000',
      ease: 'custom',
    },
    '<',
  )
    .to(
      ['.n'],
      {
        duration: 1,
        color: '#000000',
        ease: 'custom',
      },
      '<',
    )
    .to('#i-a', {
      opacity: 1,
      duration: .6,
      ease: 'easeOutQuint',
    }, '<+=1')
    .to('#i-a', {
      opacity: 1,
      duration: .6,
      ease: 'easeOutQuint',
    }, '<')

  intro.play()

})
</script>

<template>
  <div id='page' class='i'>
    <div class='i-c'>
      <div id='i-a' class='i-bio'>
        <p>
          Ash Thorp is driven by a continual pursuit of passion and curiosity. His work spans various media, but his
          true pursuit has always been photography, which he views as the perfect melding of art, science, and
          technology. Photography allows the act of a moment to be forever captured, and Ash's work aims to reveal the
          moments between moments—what exists beyond what is seen, the impression of a feeling, or an imprint of an
          idea. His traditional art background plays a crucial role in his photography, as he draws on his upbringing to
          express intention and capture the essence of a moment. Photography is a key creative component of Ash Thorp's
          body of work.
        </p>
      </div>
      <div id='i-a' class='i-credits'>
        <ul>
          <li>Contact</li>
          <li>
            <NuxtLink to='https://twitter.com/ashthorp1' target='blank' ref="noreferrer">Twitter</NuxtLink>
          </li>
          <li>
            <NuxtLink to='https://www.instagram.com/ashthorp' target='blank' ref="noreferrer">Instagram
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to='https://www.behance.net/ashthorp' target='blank' ref="noreferrer">Behance</NuxtLink>
          </li>
          <li>
            <NuxtLink to='https://vimeo.com/ashthorp' target='blank' ref="noreferrer">Vimeo</NuxtLink>
          </li>
        </ul>
      </div>
      <div id='i-a' class='i-credits'>
        <ul>
          <li>Credits</li>
          <li>Web Dev & Design</li>
          <li>
            <NuxtLink to='mailto:bentppaine@gmail.com' target='blank' ref='noreferrer'>Ben Paine</NuxtLink>
          </li>
          <li>
            <NuxtLink to='https://instagram.com/bnpne' target='blank' ref='noreferrer'>Instagram</NuxtLink>
          </li>
        </ul>

      </div>

    </div>
  </div>
</template>

<style lang="scss">
#i-a {
  opacity: 0;
  color: black;
}

.i {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: desktop-vw(20px);

  @include mobile() {
    padding: 0;

  }

  &-c {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    @include mobile() {

      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      gap: mobile-vw(40px);
    }
  }

  &-bio {
    flex: 0 0 50%;

    @include mobile() {
      flex: 1;
    }
  }

  &-credits {
    flex: 0 0 20%;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;

    @include mobile() {
      justify-content: flex-start;
      flex: 1;
    }

    >ul {
      text-align: right;

      @include mobile() {
        text-align: left;
      }
    }
  }
}
</style>
