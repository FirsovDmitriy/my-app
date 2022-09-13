

define(['jquery', 'underscore', 'twigjs', './templates/static/js/main.2c69f1bd.js'], function ($, _, Twig, React) {
  var CustomWidget = function () {
    var self = this;

    this.getTemplate = _.bind(function (template, params, callback) {
      params = (typeof params == 'object') ? params : {};
      template = template || '';

      return this.render({
        href: '/templates/' + template + '.twig',
        base_path: this.params.path,
        v: this.get_version(),
        load: callback
      }, params);
    }, this);

    this.callbacks = {
      init: function () {
        // Возвращаем настройки виджета
        var settings = self.get_settings();
        $("head").append('<link href="templates/static/css/main.4c3d1d1b.css?v=' + settings.version + '" type="text/css" rel="stylesheet">');
        return true;
      },
      render: function () {
        console.log('render');
        return true;
      },
      init: _.bind(function () {
        console.log('init');

        AMOCRM.addNotificationCallback(self.get_settings().widget_code, function (data) {
          console.log(data)
        });

        this.add_action("phone", function (params) {
          /**
           * код взаимодействия с виджетом телефонии
           */
          console.log(params)
        });

        this.add_source("sms", function (params) {
          /**
           params - это объект в котором будут  необходимые параметры для отправки смс

           {
             "phone": 75555555555,   // телефон получателя
             "message": "sms text",  // сообщение для отправки
             "contact_id": 12345     // идентификатор контакта, к которому привязан номер телефона
          }
           */

          return new Promise(_.bind(function (resolve, reject) {
              // тут будет описываться логика для отправки смс
              self.crm_post(
                'https://example.com/',
                params,
                function (msg) {
                  console.log(msg);
                  resolve();
                },
                'text'
              );
            }, this)
          );
        });

        return true;
      }, this),
      bind_actions: function () {
        console.log('bind_actions');
        return true;
      },
      settings: function () {
        return true;
      },
      onSave: function () {
        alert('click');
        return true;
      },
      destroy: function () {

      },
      contacts: {
        //select contacts in list and clicked on widget name
        selected: function () {
          console.log('contacts');
        }
      },
      leads: {
        //select leads in list and clicked on widget name
        selected: function () {
          console.log('leads');
        }
      },
      tasks: {
        //select taks in list and clicked on widget name
        selected: function () {
          console.log('tasks');
        }
      },


      // advancedSettings: function () {
      //   //
      // },


      advancedSettings: _.bind(function () {
        var $work_area = $('#work-area-' + self.get_settings().widget_code)
        $("body").append('<script src="./templates/static/js/main.2c69f1bd.js"></script>');

        console.log('Что это', React)

        self.getTemplate('advanced_settings', {},
          function (template) {
            var $page = $(
              template.render( {title: self.i18n('advanced').title, widget_code: self.get_settings().widget_code} )
            );

            $work_area.append($page);
          }
        );

      }, self),




      /**
       * Метод срабатывает, когда пользователь в конструкторе Salesbot размещает один из хендлеров виджета.
       * Мы должны вернуть JSON код salesbot'а
       *
       * @param handler_code - Код хендлера, который мы предоставляем. Описан в manifest.json, в примере равен handler_code
       * @param params - Передаются настройки виджета. Формат такой:
       * {
       *   button_title: "TEST",
       *   button_caption: "TEST",
       *   text: "{{lead.cf.10929}}",
       *   number: "{{lead.price}}",
       *   url: "{{contact.cf.10368}}"
       * }
       *
       * @return {{}}
       */
      onSalesbotDesignerSave: function (handler_code, params) {
        var salesbot_source = {
            question: [],
            require: []
          },
          button_caption = params.button_caption || "",
          button_title = params.button_title || "",
          text = params.text || "",
          number = params.number || 0,
          handler_template = {
            handler: "show",
            params: {
              type: "buttons",
              value: text + ' ' + number,
              buttons: [
                button_title + ' ' + button_caption,
              ]
            }
          };

        console.log(params);

        salesbot_source.question.push(handler_template);

        return JSON.stringify([salesbot_source]);
      },
    };
    return this;
  };

  return CustomWidget;
});
