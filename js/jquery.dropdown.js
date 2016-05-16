(function(root, $) {

	'use strict';

	function Dropdown($elem, opts) {
		this.element = $elem;

		this.status = {
			isOpen: false
		};

		this.prefixes = {
			button: 'button',
			panel: 'panel'
		};

		this.$elements = {
			buttons: null,
			panel: null
		};

		this.options = {
			animateSpeed: 150,
			fade: false,
			slide: false
		};

		this.activateClass = 'active';

		this.initialize(opts);
	}

	Dropdown.prototype = {
		initialize: function(opts) {
			// Set options
			this.setOptions(opts);

			// Set elements
			this.setElements();

			// Bind event
			this.bindEvents();
		},

		setOptions: function(opts) {
			this.options = $.extend({}, this.options, opts || {});
		},

		setElements: function() {
			var self = this,
				prefixes = self.prefixes;

			var $elem = self.element,
				$elems = self.$elements;

			$elems.buttons = $elem.findDataElements(prefixes.button);
			$elems.panel = $elem.findDataElements(prefixes.panel);
		},

		bindEvents: function() {
			// Toggle event
			this.$elements.buttons.on('click', this.toggle.bind(this));

			$(document).on('click', this.noneTargetClose.bind(this));
		},

		toggle: function() {
			var isOpen = this.status.isOpen === true;

			!isOpen ? this.activate() : this.deactivate();
		},

		noneTargetClose: function(e) {
			var hasActivate = this.element.hasClass(this.activateClass),
				hasTargetNone = this.element.has(e.target).length === 0,
				isNoneTarget = hasActivate && hasTargetNone;

			isNoneTarget && this.deactivate();
		},

		activate: function() {
			this.element.addClass(this.activateClass);
			this.options.fade === true && this.fadeActivate();
			this.options.slide === true && this.slideActivate();

			this.status.isOpen = true;
		},

		deactivate: function() {
			this.element.removeClass(this.activateClass);
			this.options.fade === true && this.fadeDeactivate();
			this.options.slide === true && this.slideDeactivate();

			this.status.isOpen = false;
		},

		fadeActivate: function() {
			var $panel = this.$elements.panel;

			$panel.css({
				display: 'block',
				opacity: 0
			}).animate({
				opacity: 1
			}, this.options.animateSpeed);
		},

		fadeDeactivate: function() {
			var $panel = this.$elements.panel;

			$panel.animate({
				opacity: 0
			}, this.options.animateSpeed, function() {
				$panel.removeAttr('style');
			});
		},

		slideActivate: function() {
			var $panel = this.$elements.panel,
				panelHeight = $panel.outerHeight();

			$panel.css({
				display: 'block',
				height: 0
			}).animate({
				height: panelHeight
			}, this.options.animateSpeed);
		},

		slideDeactivate: function() {
			var $panel = this.$elements.panel;

			$panel.animate({
				height: 0
			}, this.options.animateSpeed, function() {
				$panel.removeAttr('style');
			});
		}
	};

	$.fn.extend({
		findDataElements: function(key) {
			return $(this).find('[data-dropdown=' + key + ']');
		},

		dropdown: function(opts) {
			return this.each(function() {
				var $this = $(this),
					instanceKey = 'dropdown';

				var instance = new Dropdown($this, opts);
				$this.data(instanceKey, instance);
			});
		}
	});
}(window, jQuery));