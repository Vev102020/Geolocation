// генерация городов в поиске
$(function () {
  $("#del_cookie").on("click", function () {
    $.removeCookie("NameCity", { path: "/" });
    cityDefinition();
    location.reload();
  });

  //Определение города и запись в куки
  function cityDefinition() {
    if ($.cookie("NameCity") == undefined || $.cookie("NameCity") == null) {
      ymaps.ready(function () {
        let geolocation = ymaps.geolocation;
        if (
          geolocation.city == "" ||
          geolocation.city == undefined ||
          geolocation.city == null ||
          geolocation.city == "Не определен"
        ) {
          $.cookie("NameCity", "Москва", {
            expires: 30,
            path: "/",
          });
        } else {
          $.cookie("NameCity", geolocation.city, {
            expires: 30,
            path: "/",
          });
        }
      });
    }
  }
  cityDefinition();

  $("#nameCity").text($.cookie("NameCity"));
  let cookieCityName = $.cookie("NameCity");

  let cookieCityVal;
  let cookieRegionVal;

  //JSON ГОРОДА
  $.getJSON("/assets/areas.json", function (data) {
    //Генерация городов в поисковике
    let arrayCity = [];

    $.each(data, function (i, el) {
      if (el.areas) {
        $.each(el.areas, function (i, city) {
          arrayCity.push({ name: city.name, value: city.id });
          if (city.name == cookieCityName) {
            cookieCityVal = city.id;
            cookieRegionVal = city.parent_id;
          }
        });
      }
    });

    arrayCity.sort(function (a, b) {
      if (a.name > b.name) {
        return -1;
      }
      if (a.name < b.name) {
        return 1;
      }
      return 0;
    });

    $.each(arrayCity, function () {
      $("#select_city").prepend(
        '<option value="' + this.value + '">' + this.name + "</option>"
      );
    });

    //Запись значения начального поисковик
    $(".js-select2").chosen($("#select_city").val(cookieCityVal));

    $("#region").prepend("<ul></ul>");
    //массив для алфавитного порядка
    let array = [];

    //Город
    let NameCity;
    let ValCity;

    //Область
    let NameRegion;
    let ValRegion;

    //Запись массива
    $.each(data, function (i, el) {
      array.push({ name: el.name, value: el.id });
    });

    //Перезапись в алфавитный
    array.sort(function (a, b) {
      if (a.name > b.name) {
        return -1;
      }
      if (a.name < b.name) {
        return 1;
      }
      return 0;
    });

    //Формирование списка области
    $.each(array, function () {
      $("#region ul").prepend(
        '<li value="' + this.value + '" >' + this.name + "</li>"
      );
    });

    //Формирует первый список при загрузке
    ValRegion = cookieRegionVal;
    NameRegion = $("#region ul li:first").text();

    $("#region li[value=" + cookieRegionVal + "]").addClass("active");
    $("#city").prepend(
      '<ul value="' + ValRegion + '"><li value="0"></li></ul>'
    );
    $.each(data, function (i, el) {
      if (el.id == ValRegion) {
        $.each(el.areas, function (i, c) {
          if (c.parent_id == ValRegion) {
            $("#city ul").append(
              '<li value="' + c.id + '" >' + c.name + "</li>"
            );
          }
        });
      }
    });
    $('#city li[value="0"]').remove();
    $("#city li[value=" + cookieCityVal + "]").addClass("active");
    //Выбор города
    $("#city li").on("click", function () {
      $("#city li").removeClass("active");
      $(this).addClass("active");
      NameCity = $(this).text();
      ValCity = $(this).val();
      $("#select_city").val(ValCity);
      $(".js-select2").chosen($("#select_city").val(ValCity));
      $("#select_city").trigger("chosen:updated");
    });

    //Формирует список при выборе
    $("#region li").on("click", function () {
      $("#region li").removeClass("active");
      $(this).addClass("active");
      ValRegion = $(this).val();
      NameRegion = $(this).text();
      $("#city ul").remove();
      $("#city").prepend(
        '<ul value="' + ValRegion + '"><li value="0"></li></ul>'
      );
      $.each(data, function (i, el) {
        if (el.id == ValRegion) {
          $.each(el.areas, function (i, c) {
            if (c.parent_id == ValRegion) {
              $("#city ul").append(
                '<li value="' + c.id + '" >' + c.name + "</li>"
              );
            }
          });
        }
      });

      //Выбор города
      $("#city li").on("click", function () {
        $("#city li").removeClass("active");
        $(this).addClass("active");
        NameCity = $(this).text();
        ValCity = $(this).val();
        $("#select_city").val(ValCity);
        $(".js-select2").chosen($("#select_city").val(ValCity));
        $("#select_city").trigger("chosen:updated");
      });
      $('#city li[value="0"]').remove();
    });

    //Сохранение выбранного города
    $(".saveCity").on("click", function () {
      cookieCityVal = $("#select_city").val();
      cookieCityName = $(
        '#select_city option[value="' + cookieCityVal + '"]'
      ).text();
      $.cookie("NameCity", cookieCityName, {
        expires: 30,
        path: "/",
      });
      $("#nameCity").text($.cookie("NameCity"));
    });
  });
});
