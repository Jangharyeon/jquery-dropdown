(function(root, $) {
	function Dropdown($elem, opts) {
		this.element = $elem;

		this.status = {
			isOpen: false
		};

		this.prefixes = {
			button: 'button',
			option: 'layer'
		};

		this.$elements = {
			buttons: null,
			options: null,
			optionsLast: null
		};

		this.activateClass = 'active';

		this.initialize();
	}

	Dropdown.prototype = {
		initialize: function() {
			// Set elements
			this.setElements();

			// Bind event
			this.bindEvents();
		},

		setElements: function() {
			var self = this,
				prefixes = self.prefixes;

			var $elem = self.element,
				$elems = self.$elements;

			$elems.buttons = $elem.findDataElements(prefixes.button);
			$elems.options = $elem.findDataElements(prefixes.option);
			$elems.optionsLast = $elems.options.find('a:last');
		},

		bindEvents: function() {
			// Toggle event
			this.$elements.buttons.on('click', this.toggle.bind(this));
			this.$elements.optionsLast.on('focusout', this.focusoutClose.bind(this));

			$(document).on('click', this.noneTargetClose.bind(this));
		},

		activate: function() {
			this.element.addClass(this.activateClass);
			this.status.isOpen = true;
		},

		deactivate: function() {
			this.element.removeClass(this.activateClass);
			this.status.isOpen = false;
		},

		focusoutClose: function(e) {
			this.deactivate();
		},

		toggle: function() {
			var isOpen = this.status.isOpen === true;

			if (!isOpen) {
				this.activate();
			} else {
				this.deactivate();
			}
		},

		noneTargetClose: function(e) {
			var hasActivate = this.element.hasClass(this.activateClass),
				hasTargetNone = this.element.has(e.target).length === 0,
				isNoneTarget = hasActivate && hasTargetNone;

			if (isNoneTarget) {
				this.deactivate();
			}
		}
	};

	$.fn.extend({
		findDataElements: function(key) {
			return $(this).find('[data-dropdown=' + key + ']');
		},

		dropdown: function() {
			return this.each(function() {
				var $this = $(this),
					instanceKey = 'dropdown';

				instance = new Dropdown($this);
				$this.data(instanceKey, instance);
			});
		}
	});
}(window, jQuery));