var FormWizard = function() {


    return {
        //main function to initiate the module
        init: function() {
            if (!jQuery().bootstrapWizard) {
                return;
            }
            jQuery.validator.addMethod("MobilePhone", function(value, element) {
                return this.optional(element) || /^(\+61|0061|0)?4[0-9]{8}$/.test(value);
            }, "This is not a mobile phone number");
           jQuery.validator.addMethod("Home", function(value, element) {
                return this.optional(element) || /^[0-9]{6,10}$/.test(value);
            }, "This is not a home phone number");
             jQuery.validator.addMethod("Work", function(value, element) {
                return this.optional(element) || /^[*#-_0-9]{6,20}$/.test(value);
            }, "This is not a work phone number");

            function format(state) {
                if (!state.id) return state.text; // optgroup
                return "<img class='flag' src='../../assets/global/img/flags/" + state.id.toLowerCase() + ".png'/>&nbsp;&nbsp;" + state.text;
            }

            $("#country_list").select2({
                placeholder: "Select",
                allowClear: true,
                formatResult: format,
                width: 'auto',
                formatSelection: format,
                escapeMarkup: function(m) {
                    return m;
                }
            });

            var form = $('#submit_form');
            var error = $('.alert-danger', form);
            var success = $('.alert-success', form);

            form.validate({
                doNotHideMessage: true, //this option enables to show the error/success messages on tab switch.
                errorElement: 'span', //default input error message container
                errorClass: 'help-block help-block-error', // default input error message class
                focusInvalid: false, // do not focus the last invalid input
                rules: {
                    //Appointments Request
                    FirstName: {
                        required: true
                    },
                    LastName: {
                        required: true
                    },
                    DOB: {
                        required: true
                    },
                    Address: {
                        required: true
                    },
                    Suburb: {
                        required: true
                    },
                    Postcode: {
                        required: true,
                        maxlength: 10,
                        number: true,
                        minlength: 4
                    },
                    PhoneNumber: {
                        required: true,
                        number: true,
                        MobilePhone:true
                    },
                    Fax:{
                        number: true
                    },
                    HomePhoneNumber: {
                        Home:true
                    },
                    Email: {
                        email: true
                    },
                    'examination[]': {
                        required: true,
                        minlength: 1
                    },
                    'preferred[]': {
                        required: true,
                        minlength: 1
                    },
                    'duration[]': {
                        required: true,
                        minlength: 1
                    },
                    'BCC_radio[]': {
                        required: true,
                        minlength: 1
                    },
                    'SCC_radio[]': {
                        required: true,
                        minlength: 1
                    },
                    'Melanoma_radio[]': {
                        required: true,
                        minlength: 1
                    },
                    'Merkel_radio[]': {
                        required: true,
                        minlength: 1
                    },
                    //account
                    username: {
                        minlength: 5,
                        required: true
                    },
                    password: {
                        minlength: 5,
                        required: true
                    },
                    rpassword: {
                        minlength: 5,
                        required: true,
                        equalTo: "#submit_form_password"
                    },
                    //profile
                    fullname: {
                        required: true
                    },
                    email: {
                        required: true,
                        email: true
                    },
                    phone: {
                        required: true
                    },
                    gender: {
                        required: true
                    },
                    address: {
                        required: true
                    },
                    city: {
                        required: true
                    },
                    country: {
                        required: true
                    },
                    //payment
                    card_name: {
                        required: true
                    },
                    card_number: {
                        minlength: 16,
                        maxlength: 16,
                        required: true
                    },
                    card_cvc: {
                        digits: true,
                        required: true,
                        minlength: 3,
                        maxlength: 4
                    },
                    card_expiry_date: {
                        required: true
                    },
                    'payment[]': {
                        required: true,
                        minlength: 1
                    }
                },

                messages: { // custom messages for radio buttons and checkboxes
                    'payment[]': {
                        required: "Please select at least one option",
                        minlength: jQuery.validator.format("Please select at least one option")
                    },
                    'examination[]': {
                        required: "Please select at least one option",
                        minlength: jQuery.validator.format("Please select at least one option")
                    },
                    'preferred[]': {
                        required: "Please select at least one option",
                        minlength: jQuery.validator.format("Please select at least one option")
                    },
                    'duration[]': {
                        required: "Please select at least one option",
                        minlength: jQuery.validator.format("Please select at least one option")
                    },
                    'BCC_radio[]': {
                        required: "Please select at least one option",
                        minlength: jQuery.validator.format("Please select at least one option")
                    },
                    'SCC_radio[]': {
                        required: "Please select at least one option",
                        minlength: jQuery.validator.format("Please select at least one option")
                    },
                    'Melanoma_radio[]': {
                        required: "Please select at least one option",
                        minlength: jQuery.validator.format("Please select at least one option")
                    },
                    'Merkel_radio[]': {
                        required: "Please select at least one option",
                        minlength: jQuery.validator.format("Please select at least one option")
                    }
                },

                errorPlacement: function(error, element) { // render error placement for each input type
                    if (element.attr("name") == "gender") { // for uniform radio buttons, insert the after the given container
                        error.insertAfter("#form_gender_error");
                    } else if (element.attr("name") == "payment[]") { // for uniform checkboxes, insert the after the given container
                        error.insertAfter("#form_payment_error");
                    } else if (element.attr("name") == "examination[]") { // for uniform checkboxes, insert the after the given container
                        error.insertAfter("#form_examination_error");
                    } else if (element.attr("name") == "preferred[]") { // for uniform checkboxes, insert the after the given container
                        error.insertAfter("#form_preferred_error");
                    } else if (element.attr("name") == "duration[]") { // for uniform checkboxes, insert the after the given container
                        error.insertAfter("#form_duration_error");
                    } else if (element.attr("name") == "BCC_radio[]") { // for uniform checkboxes, insert the after the given container
                        error.insertAfter("#form_BCC_error");
                    } else if (element.attr("name") == "SCC_radio[]") { // for uniform checkboxes, insert the after the given container
                        error.insertAfter("#form_SCC_error");
                    } else if (element.attr("name") == "Melanoma_radio[]") { // for uniform checkboxes, insert the after the given container
                        error.insertAfter("#form_Melanoma_error");
                    } else if (element.attr("name") == "Merkel_radio[]") { // for uniform checkboxes, insert the after the given container
                        error.insertAfter("#form_Merkel_error");
                    } else {
                        error.insertAfter(element); // for other inputs, just perform default behavior
                    }
                },

                invalidHandler: function(event, validator) { //display error alert on form submit   
                    success.hide();
                    error.show();
                    App.scrollTo(error, -200);
                },

                highlight: function(element) { // hightlight error inputs
                    $(element)
                        .closest('.form-group').removeClass('has-success').addClass('has-error'); // set error class to the control group
                },

                unhighlight: function(element) { // revert the change done by hightlight
                    $(element)
                        .closest('.form-group').removeClass('has-error'); // set error class to the control group
                },

                success: function(label) {
                    if (label.attr("for") == "gender" || label.attr("for") == "examination[]" || label.attr("for") == "preferred[]" || label.attr("for") == "duration[]" || label.attr("for") == "BCC_radio[]" || label.attr("for") == "SCC_radio[]" || label.attr("for") == "Melanoma_radio[]" || label.attr("for") == "Merkel_radio[]") { // for checkboxes and radio buttons, no need to show OK icon
                        label
                            .closest('.form-group').removeClass('has-error').addClass('has-success');
                        label.remove(); // remove error label here
                    } else { // display success icon for other inputs
                        label
                            .addClass('valid') // mark the current input as valid and display OK icon
                            .closest('.form-group').removeClass('has-error').addClass('has-success'); // set success class to the control group
                    }
                },

                submitHandler: function(form) {
                    success.show();
                    error.hide();
                    //add here some ajax code to submit your form or just call form.submit() if you want to submit the form without ajax
                }

            });

            var displayConfirm = function() {
                $('#tab4 .form-control-static', form).each(function() {
                    var input = $('[name="' + $(this).attr("data-display") + '"]', form);
                    if (input.is(":radio")) {
                        input = $('[name="' + $(this).attr("data-display") + '"]:checked', form);
                    }
                    if (input.is(":text") || input.is("textarea")) {
                        $(this).html(input.val());
                    } else if (input.is("select")) {
                        $(this).html(input.find('option:selected').text());
                    } else if (input.is(":radio") && input.is(":checked")) {
                        $(this).html(input.attr("data-title"));
                    } else if ($(this).attr("data-display") == 'payment[]') {
                        var payment = [];
                        $('[name="payment[]"]:checked', form).each(function() {
                            payment.push($(this).attr('data-title'));
                        });
                        $(this).html(payment.join("<br>"));
                    } else if ($(this).attr("data-display") == 'examination[]') {
                        var examination = [];
                        $('[name="examination[]"]:checked', form).each(function() {
                            examination.push($(this).attr('data-title'));
                        });
                        $(this).html(examination.join("<br>"));
                    } else if ($(this).attr("data-display") == 'preferred[]') {
                        var preferred = [];
                        $('[name="preferred[]"]:checked', form).each(function() {
                            preferred.push($(this).attr('data-title'));
                        });
                        $(this).html(preferred.join("<br>"));
                    } else if ($(this).attr("data-display") == 'duration[]') {
                        var duration = [];
                        $('[name="duration[]"]:checked', form).each(function() {
                            duration.push($(this).attr('data-title'));
                        });
                        $(this).html(duration.join("<br>"));
                    }
                });
            }

            var handleTitle = function(tab, navigation, index) {
                var total = navigation.find('li').length;
                var current = index + 1;
                // set wizard title
                $('.step-title', $('#form_wizard_1')).text('Step ' + (index + 1) + ' of ' + total);
                // set done steps
                jQuery('li', $('#form_wizard_1')).removeClass("done");
                var li_list = navigation.find('li');
                for (var i = 0; i < index; i++) {
                    jQuery(li_list[i]).addClass("done");
                }

                if (current == 1) {
                    $('#form_wizard_1').find('.button-previous').hide();
                } else {
                    $('#form_wizard_1').find('.button-previous').show();
                }

                if (current >= total) {
                    $('#form_wizard_1').find('.button-next').hide();
                    $('#form_wizard_1').find('.button-submit').show();
                    displayConfirm();
                } else {
                    $('#form_wizard_1').find('.button-next').show();
                    $('#form_wizard_1').find('.button-submit').hide();
                }
                App.scrollTo($('.page-title'));
            }

            // default form wizard
            $('#form_wizard_1').bootstrapWizard({
                'nextSelector': '.button-next',
                'previousSelector': '.button-previous',
                onTabClick: function(tab, navigation, index, clickedIndex) {
                    return false;

                    success.hide();
                    error.hide();
                    if (form.valid() == false) {
                        return false;
                    }

                    handleTitle(tab, navigation, clickedIndex);
                },
                onNext: function(tab, navigation, index) {
                    success.hide();
                    error.hide();

                    if (form.valid() == false) {
                        return false;
                    }

                    handleTitle(tab, navigation, index);
                },
                onPrevious: function(tab, navigation, index) {
                    success.hide();
                    error.hide();

                    handleTitle(tab, navigation, index);
                },
                onTabShow: function(tab, navigation, index) {
                    var total = navigation.find('li').length;
                    var current = index + 1;
                    var $percent = (current / total) * 100;
                    $('#form_wizard_1').find('.progress-bar').css({
                        width: $percent + '%'
                    });
                }
            });

            $('#form_wizard_1').find('.button-previous').hide();
            $('#form_wizard_1 .button-submit').click(function() {

            }).hide();

            //apply validation on select2 dropdown value change, this only needed for chosen dropdown integration.
            $('#country_list', form).change(function() {
                form.validate().element($(this)); //revalidate the chosen dropdown value and show error or success message for the input
            });
        }

    };

}();

jQuery(document).ready(function() {
    FormWizard.init();
});
