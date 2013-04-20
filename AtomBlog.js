$(function() {
	var blogTitle = '';
	var entries = null;
	var index = -1;
	var baseURL = window.location.toString();
	var query = window.location.search.substr(1);

	if(query.length > 0) {
		baseURL = baseURL.substring(0,baseURL.indexOf('?'));
	}

	function AB_parseEntries(entryXML) {
		entries = [];
		entryXML.each(function(index,entry) {
			entries.push($(entry));
		});
		entries.sort(function(a,b) {
			var aDateStr = a.children('updated').text();
			var aDate = new Date(aDateStr);

			var bDateStr = b.children('updated').text();
			var bDate = new Date(bDateStr);
			return bDate - aDate;
		});
	}

	var nextLink = $('.nextLink');
	var prevLink = $('.prevLink');

	function AB_loadEntry(new_index) {
		if(entries === null) return;
		if(new_index < 0 || new_index >= entries.length) return;
		index = new_index;
		var entry = entries[index];

		$('#date').text(entry.children('updated').text());
		$('#entryText').html(entry.children('content').children('div').html());
		$('#rights').html(entry.children('rights').children('div').html());

		var entryTitle = entry.children('title').text();
		$('#entryTitle').text(entryTitle);

		var subTitle = entry.children('summary').text();
		$('#subTitle').text(subTitle);

		var pageTitle = blogTitle + ' - ' + entryTitle;
		document.title = pageTitle;
		window.history.pushState(null,
								 pageTitle,
								 baseURL + '?' + entry.children('AtomBlogID').text());

		// author link
		$('#author').text('Written by: ');
		var author = entry.children('author');
		var authorLink = $('<a>');
		authorLink.attr('href','mailto:'+author.children('email').text());
		authorLink.text(author.children('name').text());
		authorLink.appendTo('#author');

		// links
		if(index - 1 >= 0) {
			var next_entry = entries[index-1].children('link').first();
			nextLink.attr('href',next_entry.attr('href'));
			nextLink.removeClass('hidden');
		} else {
			nextLink.addClass('hidden');
		}
		if(index + 1 < entries.length) {
			var prev_entry = entries[index+1].children('link').first();
			prevLink.attr('href',prev_entry.attr('href'));
			prevLink.removeClass('hidden');
		} else {
			prevLink.addClass('hidden');
		}
	}

	function AB_getIndexWithID(id) {
		// remove trailing slashes
		while(id.endsWith('/')) {
			id = id.substring(0,id.length-1);
		}
		var ret = 0;
		entries.forEach(function(value,index) {
			var AtomBlogID = value.children('AtomBlogID').text();
			if(AtomBlogID === id) {
				ret = index;
			}
		});
		return ret;
	}
	
	window.AtomBlog = function AtomBlog(params) {
		$.get(params.content, function(data) {
			var feed = $(data).find('feed');
			blogTitle = feed.children('title').text();
			$('#title').text(blogTitle);
			AB_parseEntries(feed.children('entry'));
			if(query.length === 0) AB_loadEntry(0);
			else AB_loadEntry(AB_getIndexWithID(query));
		});
	};

	window.AtomBlog.nextEntry = function AB_nextEntry() {
		AB_loadEntry(index-1);
		return false;
	};

	window.AtomBlog.prevEntry = function AB_prevEntry() {
		AB_loadEntry(index+1);
		return false;
	};
	
	nextLink.click(AtomBlog.nextEntry);
	prevLink.click(AtomBlog.prevEntry);
});
