
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
        error: (error) => {
            console.log('error:', error);
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
        },
        error: (error) => {
            console.log('error:', error);
        }
      });
}

function addReview() {

      let review = $("#comment-area").val()
      let id = $("#comment-item-id").val()
      let username = $("#username").val()
      let rating = document.querySelector('input[name="rating"]:checked').value;
      console.log('review, id, rating, username', review, id, username)
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
           $("#ReviewTab").append("<p>" + `${data.text}`);
            document.getElementById('RatingCancel').click()
            document.getElementById("ReviewtOpen").click();
            document.getElementById('RatingCard').style.display = "none"
            getItemRating()
            reviewDiv.style.display = "block";
        },
        error: (error) => {
            console.log('error:', error);
        }
      });
}


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