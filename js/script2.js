/*	Table OF Contents
	==========================
	Carousel
	Customs Script [Modal Thumb | List View  Grid View + Add to Wishlist Click Event + Others ]
	Custom Parallax 
	Custom Scrollbar
	Custom animated.css effect
	Equal height ( subcategory thumb)
	responsive fix
	*/
$(document).ready(function() {

    /*==================================
	 Custom Scrollbar for Dropdown Cart 
	====================================*/
    $(".scroll-pane").mCustomScrollbar({
        advanced: {
            updateOnContentResize: true

        },

        scrollButtons: {
            enable: false
        },



        mouseWheel: { scrollAmount: 200 },
        theme: "dark",

        callbacks:{
            onInit:function(){
                console.log("scrollbars initialized");
            },

            onOverflowYNone:function(){
                console.log("Vertical scrolling is not required");
            },

            onUpdate:function(){
                console.log("Scrollbars updated");
            }
        },

        live: "on"

    });


    $(".smoothscroll").mCustomScrollbar({
        advanced: {
            updateOnContentResize: true

        },

        scrollButtons: {
            enable: false
        },



        mouseWheel: { scrollAmount: 200 },
        theme: "dark",

        callbacks:{
            onInit:function(){
                console.log("scrollbars initialized");
            }
        }

    });


}); // end Ready