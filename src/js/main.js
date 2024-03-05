

$(document).on("click", ".header-toggler", function () {
    $("#header").toggleClass('menu-opened');
    $(this).toggleClass('opened');
    $('body').toggleClass('ui-no-overflow');
});



$(document).on("click", ".vacancy-results-filter", function () {
  $(".vacancy-filters").toggleClass('mobile-opened');
});

$(document).on("click", ".vacancy-filters-close", function () {
  $(".vacancy-filters").removeClass('mobile-opened');
});


$(document).on('click', '.vacancy-filters-reset', function(e) {
  e.preventDefault();
  const form = document.querySelector('.vacancy-filters-form')
  form.reset();
  const selects = form.querySelectorAll('select')
  selects.forEach(el => {
    $(el).trigger('refresh');
  })
  form.submit();
});



{
  const header = document.querySelector("#header")
  const scrollTrigger = () => {
    if (document.querySelector('.header-line-fill')) {
      return document.querySelector('.header-line-fill').getBoundingClientRect().top + window.pageYOffset;
    }
    return 100
  }
  let headerStartFix = scrollTrigger()

  window.addEventListener('load', () => {
    headerStartFix = scrollTrigger()
  })

  window.addEventListener('resize', () => {
    headerStartFix = scrollTrigger()
  })

  window.addEventListener('scroll', function() {
    if (window.scrollY > headerStartFix) {
      header.classList.add("header-fixing")
    }  else {
      header.classList.remove("header-fixing")
    }
  })
}


if (document.querySelector('.main-screen')) {
  document.querySelector('#header').classList.add('header-main')
}

jQuery.validator.setDefaults({
  errorClass: 'ui-field-invalid',
	successClass: 'ui-field-valid',
	focusInvalid: false,
	errorElement: 'span',
  errorPlacement: function (error, element) {
    if ( element.hasClass('ui-tel') ) {
      element.closest('.iti').after(error);
    } else {
      error.insertAfter(element);
    }
  }
});
jQuery.validator.addMethod("telephone", function(value, element) {
  return this.optional(element) || /^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){6,14}(\s*)?$/i.test(value);
}, "Incorrect phone format");

jQuery.validator.addMethod(
  "lettersonly",
  function (value, element) {
    return this.optional(element) || /^[a-zA-ZА-Яа-я\s]+$/i.test(value);
  },
  "Only letters"
);


$(document).ready(function () {

  $(".ui-select").styler();

  $("form.main-job-form").validate({
    rules: {
      email: {
        email: true,
      },
      telephone: {
        required: true,
        telephone: true,
      },
    },
  });

  //пример обработки формы с предпросмотром файлов
  $(document).on('submit','form.main-job-form',function(e){
    e.preventDefault();
    //дисаблим кнопку
    $(this).find('button').attr('disabled',true);

    //Склеиваем данные формы с файлами и отправляем обработчику
    let form_data = new FormData($(this)[0]);
    if (Store.files.length) {
      Store.appendFilesInFormData(form_data);
      Store.files = [];
    }

    //аякс или фетч
    /* $.ajax({
      url: '',
      method: 'POST',
      data: form_data
      ...
      success: function() {
        $(this).find('button').removeAttr('disabled');
      }
    }) */
  });

  $("form.form-main-touch").validate({
    rules: {
      temail: {
        email: true
      },
      ttelephone: {
        telephone: true,
      }
    }
  })

  $(".ui-tel").intlTelInput({
    autoHideDialCode: false,
    autoPlaceholder: "off",
    nationalMode: false,
    separateDialCode: false,
    hiddenInput: "full_number",
  });

  $(".ui-tel").each(function () {
    let hiddenInput = $(this).attr('name');
    $("input[name="+hiddenInput+"-country-code]").val($(this).val());
  });

  $(".ui-tel").on("countrychange", function() {
    let hiddenInput = $(this).attr("name");
    $("input[name="+hiddenInput+"-country-code]").val(this.value);
  });

  $(document).on("click", ".mfp-link", function () {
    var a = $(this);
    $.magnificPopup.open({
      items: { src: a.attr("data-href") },
      type: "ajax",
      overflowY: "scroll",
      removalDelay: 300,
      mainClass: 'my-mfp-zoom-in',
      ajax: {
        tError: "Error. Not valid url",
      },
      callbacks: {
        open: function () {
          setTimeout(function(){
            $('.mfp-wrap').addClass('not_delay');
            $('.mfp-popup').addClass('not_delay');
          },700);

          document.documentElement.style.overflow = 'hidden'
        },

        close: function() {
          document.documentElement.style.overflow = ''
        }
      }
    });
    return false;
  });

});

function openInlinePopup(popupID) {
  $.magnificPopup.close();
  setTimeout(()=>{
    $.magnificPopup.open({
      items: {
        src: popupID,
        type: 'inline'
      },
      overflowY: "scroll",
      removalDelay: 300,
      mainClass: 'my-mfp-zoom-in'
    });
  },301)
}
$(document).on('click','.mfp-inline',function(e){
  e.preventDefault();
  const popupID = $(this).attr('data-popup')
  openInlinePopup(popupID)
})


function showPopup(url = 'popups/popup-thanks.html') {
  $.magnificPopup.close();
  setTimeout(()=>{
    $.magnificPopup.open({
      items: {
        src: url,
        type: "ajax"
      },
      overflowY: "scroll",
      removalDelay: 300,
      mainClass: 'my-mfp-zoom-in'
    });
  },301)
}


const Store = {
	files: [],
	removeFile: function(index) {
	  this.files.splice(index, 1);
	},
	addFiles: function(files) {
	  this.files = this.files.concat(files);
	},
	readURL: function(e,input,block) {
		const that = this;
		if (!e.target.files.length) { return }
	  const files = Object.keys(e.target.files).map((i) => e.target.files[i]);
		that.addFiles(files);
		$(block).find('.ui-uploader-file').remove();

	  for (var i = 0; i < that.files.length; i++) {
			let div = document.createElement('div');
			div.setAttribute('class','ui-uploader-file');
			div.setAttribute('data-index',i);

      const name = document.createElement('span');
      name.setAttribute('class','ui-uploader-file-name');
      name.textContent = that.files[i].name;

      $(div).append(name)
			$(div).append('<i class="ui-uploader-file-delete"></i>');
			$(block).append(div);
		}
	  e.target.value = '';
	},
	appendFilesInFormData: function(formData) {
		this.files.map((file, index) => {
			formData.append(`file${index + 1}`, file);
		});
	}
}

//добавляем файлы в хранилище и отображаем превью
$(document).on('change', ".ui-uploader-input", function(e){
  const filesContainer = $(this).closest('.ui-uploader').find('.ui-uploader-files')
  Store.readURL(e, this, filesContainer);
});

//удаляем файлы из хранилища(предпросмотр файлов)
$(document).on('click','.ui-uploader-file-delete',function(e){
  e.preventDefault();
  const index = parseInt($(this).attr('data-index'),10);
  Store.removeFile(index);
  $(this).parent().fadeOut(100).remove();
})




let itrObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      const id = entry.target.getAttribute('id') || null
      if (!id || !document.querySelector('#'+id)) return

      $('.header-nav a').removeClass('active')
      $('.header-nav a[href$='+id+']').addClass('active');
    }
  });
}, {threshold: 0.5});

window.onload = () => {
  document.querySelectorAll('.main-block, .main-screen').forEach(el => {
    itrObserver.observe(el)
  })
}
