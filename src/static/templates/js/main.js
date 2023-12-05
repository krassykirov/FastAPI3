
function openTab(evt, Description) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(Description).style.display = "block";
  evt.currentTarget.className += " active";
}

function editItem() {

      let id = $("#edit-id").val()
      let price = $("#id-price").val()
    $.ajax({
        url: "/update_price_ajax",
        method: "post",
        headers: { "Content-Type": "application/json",},
        data:  JSON.stringify({
                "id": `${id}`,
                "price": `${price}`
        }),
        success: data => {
            console.log('data:', data);
            document.getElementById('item-details').innerText = `Price: $${parseFloat(data.price).toFixed(2)}`;
            document.getElementById('close').click()
        },
        error: (response) => {
          if (response.status === 403) {
            $("#EditPriceLabel").text(response.responseJSON.detail)
         }
        }
      });
}

function updateDescription() {

      let id = $("#item-id").val()
      let description = $("#id-description").val()
    $.ajax({
        url: "/update_description_ajax",
        method: "post",
        headers: { "Content-Type": "application/json",},
        data:  JSON.stringify({
                "id": `${id}`,
                "description": `${description}`
        }),
        success: data => {
            console.log('data:', data);
            document.getElementById('description-text').innerText = `${data.description}`;
            document.getElementById('close').click()
            document.getElementById("description-div").style.display = 'none'
        },
        error: (error) => {
            console.log('error:', error)
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
           const reviewDiv = document.getElementById('ReviewTab')
           console.log('data:', data, data.rating)
           const newCard = `
           <div class="card group1" id="card${data.id}" style="display: flex; margin-left:7%">
                <div class="row">
                <div class="col-12" style="margin-bottom: 5px;" style="max-width: 35%;">
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
            document.getElementById('RatingCancel').click()
            $("#ReviewTab").append(newCard)
            $("#ReviewTab").append('<a href="#" id="loadMore" style="margin-left:7%">Load More</a>');
            reviewDiv.style.display = "block";
            // window.location.href = `/items/${id}`
        },
        error: (response) => {
          if (response.status === 403) {
            $("#comment-area").val(response.responseJSON.detail)
         }
        }
      });
}

$(document).ready(function() {
  $('#createItem').submit(function(e) {
    e.preventDefault();
    var formData = new FormData(this)
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

// $(".navbar-item").on("click", function() {
//   $(".navbar-item").removeClass("active");
//   $(this).addClass("active");
// }); 
//fetchCategories
// function fetchCategories() {
//      fetch('/categories')
//     .then(response => response.json())
//     .then(data => {
//       const updatedDiv = document.getElementById('categories')
//       console.log('data', data)
//       const FormattedData = data.map(item=> `Name: ${item.name}, ID: ${item.id}`).join('<br>')
//       // $("#categories").show();
//       // updatedDiv.innerHTML = `<p> Name: ${data.name}, ID ${data.id} <\p>`
//       updatedDiv.innerHTML = FormattedData
//       if (updatedDiv.style.display === "none") {
//           updatedDiv.style.display = "block";
//           document.getElementById('fetch-button').innerHTML = "Hide Categories"
//         } else {
//           updatedDiv.style.display = "none";
//           document.getElementById('fetch-button').innerHTML = "Show Categories"
//         }
//     })
//     .catch(error => console.log("error:", error))
// }
// document.getElementById('fetch-button').onclick = fetchCategories;

//fetchEvents
// function fetchItems() {
//      fetch('/items')
//     .then(response => response.json())
//     .then(data => {
//       const updatedDiv = document.getElementById('events')
//       console.log('data', data)
//       const FormattedData = data.map(item => `Product_code: ${item.product_code},
//                                               Date: ${item.date},
//                                               Price: ${item.price},
//                                               Category: ${item.price}`).join('<br>')
//       updatedDiv.innerHTML = FormattedData
//       if (updatedDiv.style.display === "none") {
//           updatedDiv.style.display = "block";
//           document.getElementById('fetch-button2').innerHTML = "Hide Events"
//         } else {
//           updatedDiv.style.display = "none";
//           document.getElementById('fetch-button2').innerHTML = "Show Events"
//         }
//     })
//     .catch(error => console.log("error:", error))
// }
// document.getElementById('fetch-button2').onclick = fetchItems;

// createCategory
// async function createCategory() {
//   const categoryName = document.getElementById('cat-name').value

//   await fetch('/categories', {
//        method: "POST",
//        headers: {"Content-Type": "application/json",},
//        body: JSON.stringify({"name": categoryName}), // body data type must match "Content-Type" header
//   })
//   .then(response => response.json())
//   .then(result => {
//        const responseDiv = document.getElementById('responseDiv');
//        console.log('result', result)
//        if (result.detail){
//         responseDiv.innerHTML = `${result.detail}`
//        }
//        else {
//        responseDiv.innerHTML = `Created Category: ${result.name}, ID: ${result.id} `;
//        }
//        if (responseDiv.style.display === "none") {
//         responseDiv.style.display = "block";
//         }
// })
//   .catch(error => console.log("error:", error));
// }

// document.getElementById('create-cat').onclick = createCategory;

// function addItem(item) {
//         $("#catalog-table").append(
//             `<tr>
//             <td class="event-product_code">${item.name}</td>
//             <td class="event-product_code">${item.product_code}</td>
//             <td class="event-date">${item.date}</td>
//             <td class="event-price">$${parseFloat(item.price).toFixed(2)}</td>
//             <td class="event-purchase-button"><a href="/items/1"><button>Purchase Details</button></a></td>
//             </tr>`);
//     }


// $(document).ready(function () {
//     $.ajax({
//         url: "/items/",
//         success: data => {
//             data.map(item => addItem(item));
//             $("#catalog-table").show();
//         },
//         error: (_, textStatus, errorThrown) => {
//             $("#loading p")[0].innerText = `${textStatus}: ${errorThrown}`;
//         }
//       });
// });

// function createItem(item){

//     let name = $("#id-name").val()
//     let price = $("#id-price").val()
//     console.log("DATA:", name, price)
//   $.ajax({
//         url: "/items",
//         method: "post",
//         headers: { "Content-Type": "application/json",},
//         data:  JSON.stringify({
//                 "name": `${name}`,
//                 "price": `${price}`,
//         }),
//         success: data => {
//             console.log('data:', data)
//             addItem(data);
//             $("#catalog-table").show();
//         },
//         error: (error) => {
//           console.log("error:", error)
//         }
//       });
// }
// document.getElementById('create-item').onclick = createItem;


// function loadItems(){

//   $.ajax({
//       url: "/items/",
//       success: data => {
//         const updatedDiv = document.getElementById('items')
//         console.log('data', data)
//         const FormattedData = data.map(item => `Name: ${item.name}
//                                                 Product_code: ${item.product_code},
//                                                 Date: ${item.date},
//                                                 Price: ${item.price},
//                                                 Category: ${item.price}`).join('<br>')
//       updatedDiv.innerHTML = FormattedData
//       if (updatedDiv.style.display === "none") {
//           updatedDiv.style.display = "block";
//           document.getElementById('fetch-button3').innerHTML = "Hide Events"
//         } else {
//           updatedDiv.style.display = "none";
//           document.getElementById('fetch-button3').innerHTML = "Show Events"
//         }
//       },
//       error: (_, textStatus, errorThrown) => {
//           $("#loading p")[0].innerText = `${textStatus}: ${errorThrown}`;
//       }
//     });
// };

// document.getElementById('fetch-button3').onclick = loadItems;