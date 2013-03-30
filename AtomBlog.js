$(function() {
	var entries = null;
	var index = -1;

	function AB_parseEntries(entryXML) {
		entries = [];
		entryXML.each(function(index,entry) {
			console.log($(entry));
			entries.push($(entry));
		});
		entries.sort(function(a,b) {
			var aDateStr = a.children('updated').text();
			console.log(aDateStr)
			var aDate = new Date(aDateStr);
			console.log(aDate);

			var bDateStr = b.children('updated').text();
			console.log(bDateStr);
			var bDate = new Date(bDateStr);
			console.log(bDate);

			console.log(aDate - bDate);
			
			return bDate - aDate;
		});
	}

	var nextLink = $('<a>');
	nextLink.attr('href','javascript:AtomBlog.nextEntry()');
	nextLink.text('Next Entry ->');
	var prevLink = $('<a>');
	prevLink.attr('href','javascript:AtomBlog.prevEntry()');
	prevLink.text('<- Previous Entry');

	function AB_loadEntry(new_index) {
		if(entries === null) return;
		if(new_index < 0 || new_index >= entries.length) return;
		index = new_index;
		var entry = entries[index];

		$('#date').text(entry.children('updated').text());
		$('#content').html(entry.children('content').children('div').html());

		// author link
		$('#author').text('Written by: ');
		var author = entry.children('author');
		var authorLink = $('<a>');
		authorLink.attr('href','mailto:'+author.children('email').text());
		authorLink.text(author.children('name').text());
		authorLink.appendTo('#author');

		// links
		$('.nextLink').text('');
		$('.prevLink').text('');
		if(index - 1 >= 0) {
			console.log('Adding next link');
			nextLink.appendTo('.nextLink');
		}
		if(index + 1 < entries.length) {
			console.log('Adding previous link');
			prevLink.appendTo('.prevLink');
		}
	}
	
	window.AtomBlog = function AtomBlog(params) {
		$.get(params.content, function(data) {
			var feed = $(data).find('feed');
			var blogTitle = feed.children('title').text();
			console.log('blog.title: ' + blogTitle);
			$('#title').text(blogTitle);
			AB_parseEntries(feed.children('entry'));
			AB_loadEntry(0);
		});
	};

	window.AtomBlog.nextEntry = function AB_nextEntry() {
		AB_loadEntry(index-1);
	};

	window.AtomBlog.prevEntry = function AB_prevEntry() {
		AB_loadEntry(index+1);
	};
});