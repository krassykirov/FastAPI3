

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
           <div class="card group1" id="card${data.id}" style="display: flex; margin-left:6%">
                <div class="row">
                <div class="col-12" style="margin-bottom: 3px;" style="max-width: 35%;">
                <p>
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
            $("#review1").append(newCard)
            $("#review1").append('<a href="#" id="loadMore" style="margin-left:6%">Load More</a>');
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
        url: "/user/create_item",
        type: "POST",
        processData: false,
        contentType: false,
        data: formData,
        success: function(data){
          window.location.href = "/user/items"
        },
        error: function (xhr) {
            if (xhr.status === 403) {
               $('#error').text('Item with that name already exists!')
            }
        }
      });
   }
)});

function addItemToCart() {
  let id = $("#edit-id").val()
  let username = $("#username").val()
$.ajax({
    url: "/update-basket",
    method: "post",
    headers: { "Content-Type": "application/json",},
    data:  JSON.stringify({
          "item_id": `${id}`,
        }),
    success: data => {
      console.log('success', data)
    },
    error: (error) => {
      console.log('error', error)
    }
  });
}

function setItemsLen(){
  $.ajax({
        url: "/user_items_in_cart",
        method: "get",
        headers: { "Content-Type": "application/json",},
        success: data => {
            document.getElementById('cart-len').innerText = data.items_in_cart
        },
        error: (error) => {
            console.log('error:', error);
        }
      });
   }

$(document).ready(function() {
    setItemsLen()
});

// function getCategories(){
//   $.ajax({
//         url: "/products/{category_name}",
//         method: "get",
//         headers: { "Content-Type": "application/json",},
//         success: data => {
//             document.getElementById('cart-len').innerText = data.items_in_cart
//         },
//         error: (error) => {
//             console.log('error:', error);
//         }
//       });
//    }



