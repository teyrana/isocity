/* eslint-disable no-unused-vars */

const registerToolHeadings = _ => {
  document.querySelectorAll('.section-header').forEach(div => {
    div.addEventListener('click', event => {
      event.stopPropagation()

      // console.log("@@ element: ", event.target.closest('.tool-section').id)

      const content = event.target.closest('.tool-section').querySelector('.section-content')

      // console.log("::content::", content)
      // console.log(window.getComputedStyle(content).display)
      if (window.getComputedStyle(content).display === 'grid') {
        // hide element
        content.style.display = 'none'
      } else {
        // show element
        content.style.display = 'grid'
      }
    })
  })
}
