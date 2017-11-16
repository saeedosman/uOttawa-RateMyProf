var url = "";

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(sender.tab ?
            "from a content script:" + sender.tab.url :
            "from the extension");

        if (request.type === 'showPageAction') {
            chrome.pageAction.show(sender.tab.id);
            return;
        } else {
            searchProfessor(request, sender, sendResponse);
            return true;
        }
    });

function searchProfessor(request, sender, sendResponse) {

    var name = request.professor.split(' ').join('+');
    name = name.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    console.log(name);


    $.get('https://www.ratemyprofessors.com/search.jsp?query=' + name + "+university+of+ottawa", function(response) {
        var link = "https://www.ratemyprofessors.com" + $(response).find('ul[class="listings"]').children().first().children().first().attr("href");
        getRatings(request, sender, sendResponse, link)
    });
}

function getRatings(request, sender, sendResponse, link) {
    console.log(link)

    if (link.indexOf("undefined") > -1) {
        sendResponse({ quality: "", takeAgain: "", difficulty: "", link: "" });
    } else $.get(link, function(response) {

        var quality = $(response).find('div[class="grade"]:eq(0)').text().trim();
        var takeAgain = $(response).find('div[class="grade"]:eq(1)').text().trim();
        var difficulty = $(response).find('div[class="grade"]:eq(2)').text().trim();

        sendResponse({ quality, takeAgain, difficulty, link });
    });
}
