$(document).ready(function() {
  $('#createItem').submit(function(e) {
    e.preventDefault();
    var formData = new FormData(this)
    console.log('formData', formData)
    $.ajax({
        url: "/products/create_item",
        type: "POST",
        processData: false,
        contentType: false,
        data: formData,
        success: function(data){
          window.location.href = "/products"
        },
        error: function (xhr) {
            if (xhr.status === 403) {
               $('#error').text('Item with that name already exists!')
            }
        }
      });
   }
)});

document.addEventListener('DOMContentLoaded', function () {
 const navLinks = document.querySelectorAll('.nav-link');
 navLinks.forEach(link => {
  link.addEventListener('click', function() {
    navLinks.forEach(otherLink => {
      otherLink.classList.remove('active');
    });
    this.classList.add('active')
    });
 });
  const currentUrl = window.location.href;
  navLinks.forEach(link => {
    const linkUrl = link.href;
    if (currentUrl === linkUrl){
      link.classList.add('active')
    }
  });
})


function ShowReview(){
  var x  = document.getElementById('RatingCard')
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}

function Search() {
  var input, filter, cards, cardContainer, h5, title, i;
  input = document.getElementById("filter");
  filter = input.value.toUpperCase();
  cardContainer = document.getElementById("mycard");
  cards = cardContainer.getElementsByClassName("card");
  for (i = 0; i < cards.length; i++) {
      title = cards[i].querySelector(".card-body h5.card-title");
      if (title.innerText.toUpperCase().indexOf(filter) > -1) {
          cards[i].style.display = "";
      } else {
          cards[i].style.display = "none";
      }
  }
}

// function SearchWish() {
//   var input, filter, cards, cardContainer, h5, title, i;
//   input = document.getElementById("filter");
//   filter = input.value.toUpperCase();
//   cardContainer = document.getElementById("mycard");
//   cards = cardContainer.getElementsByClassName("product-grid");
//   for (i = 0; i < cards.length; i++) {
//       title = cards[i].querySelector(".h3.title");
//       if (title.innerText.toUpperCase().indexOf(filter) > -1) {
//           cards[i].style.display = "";
//       } else {
//           cards[i].style.display = "none";
//       }
//   }
// }

// $(document).ready(function(){
//   var hiddenCardsOnLoad = $(".card:hidden").length;
//   if (hiddenCardsOnLoad === 0) {
//     $("#loadMore").hide();
//   }
//   // Initially show the first 4 cards
//   $("#home-tab-pane > .card.group1").slice(0, 2).show();

//   // Use event delegation to handle click on dynamically added elements
//   $("#home-tab-pane").on("click", "#loadMore", function(e){
//     e.preventDefault();

//     // Check if the button is in "Show Less" state
//     if ($("#loadMore").text() === "Show Less") {
//       // Hide 2 cards
//       $(".card.group1:visible").slice(0, 2).hide()
//       $("#loadMore").text("Load More"); // Change button text to "Load More"
//     } else {
//       // Show the next set of cards
//       $(".card.group1:hidden").slice(0, 4).slideDown();
//       $("#loadMore").text("Show Less"); // Change button text to "Show Less"
//     }
//   });
// });


// document.getElementById('edit-button').onclick = editItem;
// document.getElementById('SendRaiting').onclick = addReview; 
// document.getElementById('add-to-cart').onclick = addItemToCart;




