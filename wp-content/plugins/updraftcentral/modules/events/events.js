jQuery(function($) {
	new UpdraftCentral_Events_Management();
});

/**
 * An object for viewing recorded events
 *
 * @constructor
 * @return {void}
 */
function UpdraftCentral_Events_Management() {
	var self = this;
	var $ = jQuery;
	var sites = new UpdraftCentral_Collection();
	var debug_level = UpdraftCentral.get_debug_level();
	var is_subscribed = false;
	this.container_visible_state = {
		search: true,
		sites: true
	}
	this.initial_load = 0;
	
	/**
	 * Subscribe to events table changes (e.g. addition of child nodes to adjust to mobile view) and
	 * add/update listeners to work on the newly added elements.
	 *
	 * @return {void}
	 */
	this.update_listener_on_mobile_view = function() {
		if (!is_subscribed) {
			UpdraftCentral.subscribe_to_node_changes($('table#updraftcentral_events_table > tbody'), function(changes, observer) {
				var added = [];
				for (var i=0; i<changes.length; i++) {
					var record = changes[i];
					if (record.addedNodes.length) added.push(record.addedNodes[0].className);
				}

				if (-1 !== added.indexOf('child')) {
					$('a.updraftcentral_events_result_view').off('click').on('click', function() {
						var events_result_data = atob($(this).attr('data-event_result_data'));
						UpdraftCentral_Library.dialog.alert('<h2>'+udclion.events.events_result_data+'</h2><p><div class="updraftcentral_events_result_data">'+events_result_data+'</div></p>');
					});
				}
			}, 'events-table');
			is_subscribed = true;
		}
	}

	/**
	 * Attaches the website option box to the events table UI
	 *
	 * @param string  sites_option    A list of user sites as a dropdown option that had events captured
	 * @param integer initial_site_id The site_id of the first site
	 *
	 * @return {void}
	 */
	function attach_site_option(sites_option, initial_site_id) {
		$('#updraftcentral_events_table_site').html('<label>'+udclion.events.website+':</label>');
		$('<select/>', {
			name: 'updraftcentral_events_table_site',
			'aria-controls': 'updraftcentral_events_table',
			change: function() {
				var table = $('#updraftcentral_events_table').DataTable();
				table.columns.adjust().draw();
			},
		}).html(sites_option).appendTo($('#updraftcentral_events_table_site > label')).val(initial_site_id);
	}

	/**
	 * Retrieves user sites with captured events
	 *
	 * @param function callback A function to call after we retrieve and process the sites
	 *
	 * @return {void}
	 */
	function load_event_sites(callback) {
		UpdraftCentral.send_ajax('load_event_sites', {}, null, 'via_mothership_encrypting', $('#updraftcentral_panel_events'), function(resp, code, error_code) {
			if ('ok' === code && resp.hasOwnProperty('message') && 'success' === resp.message) {
				var sites_option = (resp.event_sites.length) ? '' : null;
				var initial_site_id = null;
				$.each(resp.event_sites, function(index, data) {
					if (data.hasOwnProperty('site_id')) {
						if (null === initial_site_id) initial_site_id = data.site_id;
						sites_option += '<option value="'+data.site_id+'">'+data.description+'</option>';
					}
				});
				if ('function' === typeof callback) {
					callback.apply(this, [sites_option, initial_site_id]);
				}
			}
		});
	}

	/**
	 * Builds the events table UI and loads the events captured for certain actions
	 *
	 * @param string  sites_option    A list of user sites as a dropdown option that had events captured
	 * @param integer initial_site_id The site_id of the first site
	 *
	 * @return {void}
	 */
	function load_events_table(sites_option, initial_site_id) {
		self.initial_load = 1;
		if (!$.fn.DataTable.fnIsDataTable($('#updraftcentral_events_table').get(0))) {
			var spinner;
			$('#updraftcentral_events_table').on('draw.dt', function() {
				$('a.updraftcentral_events_result_view').on('click', function() {
					var events_result_data = atob($(this).attr('data-event_result_data'));
					UpdraftCentral_Library.dialog.alert('<h2>'+udclion.events.events_result_data+'</h2><p><div class="updraftcentral_events_result_data">'+events_result_data+'</div></p>');
				});
				self.update_listener_on_mobile_view();
			}).on('preXhr.dt', function(e, settings, data) {
				spinner = $(this).find('.updraftcentral_spinner');
				if (0 === spinner.length) {
					$(this).prepend('<div class="updraftcentral_spinner"></div>');
				}
			}).on('xhr.dt', function(e, settings, json, xhr) {
				spinner = $(this).find('.updraftcentral_spinner');
				if (spinner.length) spinner.remove();
			}).DataTable({
				dom: 'l<"#updraftcentral_events_table_site.dataTables_site">frtip',
				autoWidth: true,
				bStateSave: false,
				lengthMenu: [[10, 25, 50, 100], [10, 25, 50, 100]],
				responsive: true,
				processing: false,
				serverSide: true,
				infoCallback: function(settings, start, end, max, total, pre) {
					start = (0 === total) ? 0 : start;
					var pagination_status = sprintf(udclion.events.showing, start, end, total);
					if (total !== max) {
						pagination_status += ' ('+sprintf(udclion.events.filtered_from, max)+')';
					}

					return pagination_status;
				},
				ajax: {
					url: udclion.ajaxurl,
					type: "POST",
					data: function(dtp) {
						dtp_data = $.extend({}, dtp);

						var site_id = $('#updraftcentral_events_table_site select').val();
						if (null == initial_site_id) initial_site_id = 0;
						dtp_data.site_id = ('undefined' !== typeof site_id) ? site_id : initial_site_id;
						dtp_data.initial_load = self.initial_load;
						if (self.initial_load) self.initial_load = 0;

						dtp.action = 'updraftcentral_dashboard_ajax';
						dtp.subaction = 'events';
						dtp.component = 'dashboard';
						dtp.nonce = udclion.updraftcentral_dashboard_nonce;
						dtp.data = dtp_data;
						return dtp;
					},
					dataFilter: function(data) {
						try {
							var json = JSON.parse(data);
							json.recordsTotal = parseInt(json.recordsTotal);
							json.recordsFiltered = parseInt(json.recordsTotal);
							return JSON.stringify(json);
						} catch(e) {
							return data;
						}
					}
				},
				columns: [
					{ data: 'event_name' },
					{ data: 'description' },
					{ data: 'event_status' },
					{ data: 'time' },
					{ data: 'event_result_data' }
				]
			});

			if (sites_option) {
				attach_site_option(sites_option, initial_site_id);
			} else {
				$('#updraftcentral_events_table_site').html('');
			}
		}
	}

	// Register the row clickers and modal listeners which are active in every tab
	$('#updraftcentral_dashboard_existingsites').on('updraftcentral_dashboard_mode_set', function(event, data) {

		if (data && data.hasOwnProperty('new_mode') && data.new_mode === 'events') {
			// Since we're going to forcefully hide the search and sites container, thus, it is only appropriate
			// to preserve the current visible states of these containers so that we can restore it later from where
			// it was before we hide them.
			self.container_visible_state.search = $('#updraftcentral_sites_search_area').is(':visible');
			self.container_visible_state.sites = $('#updraftcentral_dashboard_existingsites_container').is(':visible');

			$('#updraftcentral_sites_search_area').hide();
			$('#updraftcentral_dashboard_existingsites_container').hide();

			load_event_sites(function(sites_option, initial_site_id) {
				load_events_table(sites_option, initial_site_id);
			});
			return;
		} else if (data && data.hasOwnProperty('previous_mode') && data.hasOwnProperty('new_mode')) {
			if ('events' === data.previous_mode && 'events' !== data.new_mode && 'notices' !== data.new_mode) {
				// We will only show the search and sites container if their previous states was set to visible before
				// we hide them, if not, then we will leave it as is, as other features/functions of UpdraftCentral might have
				// hide them intentionally.
				if (self.container_visible_state.search) $('#updraftcentral_sites_search_area').show();
				if (self.container_visible_state.sites) $('#updraftcentral_dashboard_existingsites_container').show();
			}
		}

		/**
		 * Handles the click event of the refresh list button
		 *
		 * @see {UpdraftCentral.register_event_handler}
		 */
		UpdraftCentral.register_event_handler('click', 'button#uc-btn-refresh-list', function() {
			var table = $('#updraftcentral_events_table').DataTable();
			table.search('');
			table.page.len(10);
			self.initial_load = 1;

			var site_select_container = $('#updraftcentral_events_table_site');
			if (site_select_container.length && !site_select_container.get(0).hasChildNodes()) {
				load_event_sites(function(sites_option, initial_site_id) {
					if (sites_option) {
						attach_site_option(sites_option, initial_site_id);
						table.columns.adjust().draw();
					}
				});
			} else {
				var site_select = $('#updraftcentral_events_table_site label > select');
				if (site_select.length) site_select.get(0).selectedIndex = 0;
				table.columns.adjust().draw();
			}
		});
	});
}
