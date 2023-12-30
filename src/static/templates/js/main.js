

function editItem() {
      let id = $("#edit-id").val()
      let price = $("#id-price").val()
      let category = document.getElementById('category-select').value;
      let description = document.getElementById('id-description').value;
    $.ajax({
        url: "/update_product_ajax",
        method: "post",
        headers: { "Content-Type": "application/json",},
        data:  JSON.stringify({
                "id": `${id}`,
                "price": `${price}`,
                "category": `${category}`,
                "description": `${description}`
        }),
        success: data => {
            document.getElementById('item-details').innerText = `Price: $${parseFloat(data.price).toFixed(2)}`;
            document.getElementById('category').innerText = `Category: ${data.category.name}`;
            document.getElementById('description-text').innerText = `${data.description}`;
            document.getElementById('close').click()
        },
        error: (response) => {
          if (response.status === 403) {
            $("#EditPriceLabel").text(response.responseJSON.detail)
         }
        }
      });
}

function addReview() {

      let review = $("#comment-area").val()
      let id = $("#comment-item-id").val()
      let username = $("#username").val()
      let rating = document.querySelector('input[name="rating"]:checked').value;
    $.ajax({
        url: "/create_review_ajax",
        method: "post",
        headers: { "Content-Type": "application/json",},
        data:  JSON.stringify({
                "text": `${review}`,
                "item_id": `${id}`,
                "rating": `${rating}`,
                "created_by": `${username}`
        }),
        success: data => {
           const reviewDiv = document.getElementsByClassName('card group1"')
           const newCard = `
           <div class="card group1" id="card${data.id}" style="display: flex; margin-left:0; margin-bottom:3">
                <div class="row" style="margin-left:0>
                <div class="col-12" style="margin-bottom: 3px; margin-left:0"  style="max-width: 35%;">
                <p style="margin-left:0">
                <img src="/static/img/img_avatar.png" class="avatar">
                  ${data.created_by}
                  <span class="fa fa-star checked" id="star${data.id}1"></span>
                  <span class="fa fa-star checked" id="star${data.id}2"></span>
                  <span class="fa fa-star checked" id="star${data.id}3"></span>
                  <span class="fa fa-star" id="star${data.id}4"></span>
                  <span class="fa fa-star" id="star${data.id}5"></span>
                  <div>  <i>${data.text} </i></div>
                </p>
                </div>
                </div>
           </div >
           `
            getItemRating()
            setRveiewsRating()

            // document.getElementById('RatingCancel').click()
            $("#home-tab-pane").append(newCard)
            $("#home-tab-pane").append('<a href="#" id="loadMore" style="margin-left:0%">Load More</a>');
            // reviewDiv.style.display = "block";
            // window.location.href = `/items/${id}`
        },
        error: (response) => {
          if (response.status === 403) {
            $("#comment-area").val(response.responseJSON.detail)
         }
        }
      });
};

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

// function addItemToCart() {
//   let id = $("#edit-id").val();
//   $.ajax({
//       url: "/update-basket",
//       method: "post",
//       headers: { "Content-Type": "application/json",},
//       data:  JSON.stringify({
//             "item_id": `${id}`,
//           }),
//       success: data => {
//         console.log('success', data)
//       },
//       error: (error) => {
//         console.log('error', error)
//       }
//     });
//   }

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

$(document).ready(function() {
  $('#deleteForm').submit(function(e) {
    e.preventDefault();
    let id = $("#delete-id").val()
    $.ajax({
        url: "/items/" + id,
        type: "POST",
        headers: {"Content-Type": "application/json",},
        data:  { "id": `${id}`},
        success: function(data){
          window.location.href = "/products"
        },
        error: function (xhr) {
            if (xhr.status === 403) {
               $('#errorMeassge').text('User is not allowed to delete this item!')
            }
        }
      });
   }
)});

// $(document).ready(function() {
//     getItemRating()
//     setRveiewsRating()
// });


function ShowReview(){
  var x  = document.getElementById('RatingCard')
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}


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




