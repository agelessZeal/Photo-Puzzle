var initDemo = function () {
    var header = document.getElementById("header");
    var skin = location.href.split('skin=')[1];

    if (!skin) {
        skin = 'Snapgram';
    }

    if (skin.indexOf('#') !== -1) {
        skin = skin.split('#')[0];
    }

    var skins = {
        'Snapgram': {
            'avatars': true,
            'list': false,
            'autoFullScreen': false,
            'cubeEffect': true
        },

        'VemDeZAP': {
            'avatars': false,
            'list': true,
            'autoFullScreen': false,
            'cubeEffect': false
        },

        'FaceSnap': {
            'avatars': true,
            'list': false,
            'autoFullScreen': true,
            'cubeEffect': false
        },

        'Snapssenger': {
            'avatars': false,
            'list': false,
            'autoFullScreen': false,
            'cubeEffect': false
        }
    };

    var timeIndex = 0;
    var shifts = [35, 60, 60 * 3, 60 * 60 * 2, 60 * 60 * 25, 60 * 60 * 24 * 4, 60 * 60 * 24 * 10];
    var timestamp = function () {
        var now = new Date();
        var shift = shifts[timeIndex++] || 0;
        var date = new Date(now - shift * 1000);

        return date.getTime() / 1000;
    };

    var stories = new Zuck('stories', {
        backNative: true,
        previousTap: true,
        autoFullScreen: skins[skin]['autoFullScreen'],
        skin: skin,
        avatars: skins[skin]['avatars'],
        list: skins[skin]['list'],
        cubeEffect: skins[skin]['cubeEffect'],
        localStorage: true,
        stories: [
            {
                id: "thor",
                photo: "https://www.mikeplanzer.ch/storyquiz/img/avatars/1_thor.jpg",
                name: "Thor",
                link: "",
                lastUpdated: timestamp(),
                items: [
                    Zuck.buildItem("thor-1", "photo", 3, "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_1.jpg", "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_1.jpg", '', false, false, timestamp()),
                    Zuck.buildItem("thor-2", "photo", 3, "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_2.jpg", "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_2.jpg", '', false, false, timestamp()),
                    Zuck.buildItem("thor-3", "photo", 3, "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_3.jpg", "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_3.jpg", '', false, false, timestamp()),
                    Zuck.buildItem("thor-4", "photo", 3, "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_4.jpg", "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_4.jpg", '', false, false, timestamp()),
                    Zuck.buildItem("thor-5", "photo", 3, "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_5.jpg", "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_5.jpg", '', false, false, timestamp()),
                    Zuck.buildItem("thor-6", "photo", 3, "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_6.jpg", "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_6.jpg", '', false, false, timestamp()),
                    Zuck.buildItem("thor-7", "photo", 3, "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_7.jpg", "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_7.jpg", '', false, false, timestamp()),
                    Zuck.buildItem("thor-8", "photo", 3, "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_8.jpg", "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_8.jpg", '', false, false, timestamp()),
                    Zuck.buildItem("thor-9", "photo", 3, "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_9.jpg", "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_9.jpg", '', false, false, timestamp()),
                    Zuck.buildItem("thor-10", "photo", 3, "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_10.jpg", "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_10.jpg", '', false, false, timestamp()),
                    Zuck.buildItem("thor-11", "photo", 3, "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_11.jpg", "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_11.jpg", '', false, false, timestamp()),
                    Zuck.buildItem("thor-12", "photo", 3, "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_12.jpg", "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_12.jpg", '', false, false, timestamp()),
                    Zuck.buildItem("thor-13", "photo", 3, "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_13.jpg", "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_13.jpg", '', false, false, timestamp()),
                    Zuck.buildItem("thor-14", "photo", 3, "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_14.jpg", "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_14.jpg", '', false, false, timestamp()),
                    Zuck.buildItem("thor-15", "photo", 3, "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_15.jpg", "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_15.jpg", '', false, false, timestamp()),
                    Zuck.buildItem("thor-16", "photo", 3, "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_16.jpg", "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_16.jpg", '', false, false, timestamp()),
                    Zuck.buildItem("thor-17", "photo", 3, "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_17.jpg", "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_17.jpg", '', false, false, timestamp())
                ]
            },
            {
                id: "sensa",
                photo: "https://www.mikeplanzer.ch/storyquiz/img/avatars/2_sersei.jpg",
                name: "Sensa",
                link: "",
                lastUpdated: timestamp(),
                items: [
                    Zuck.buildItem("thor-1", "photo", 3, "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_1.jpg", "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_1.jpg", '', false, false, timestamp()),
                    Zuck.buildItem("thor-2", "photo", 3, "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_2.jpg", "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_2.jpg", '', false, false, timestamp()),
                    Zuck.buildItem("thor-3", "photo", 3, "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_3.jpg", "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_3.jpg", '', false, false, timestamp()),
                    Zuck.buildItem("thor-4", "photo", 3, "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_4.jpg", "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_4.jpg", '', false, false, timestamp()),
                    Zuck.buildItem("thor-5", "photo", 3, "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_5.jpg", "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_5.jpg", '', false, false, timestamp()),
                    Zuck.buildItem("thor-6", "photo", 3, "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_6.jpg", "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_6.jpg", '', false, false, timestamp()),
                    Zuck.buildItem("thor-7", "photo", 3, "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_7.jpg", "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_7.jpg", '', false, false, timestamp()),
                    Zuck.buildItem("thor-8", "photo", 3, "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_8.jpg", "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_8.jpg", '', false, false, timestamp()),
                    Zuck.buildItem("thor-9", "photo", 3, "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_9.jpg", "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_9.jpg", '', false, false, timestamp()),
                    Zuck.buildItem("thor-10", "photo", 3, "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_10.jpg", "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_10.jpg", '', false, false, timestamp()),
                    Zuck.buildItem("thor-11", "photo", 3, "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_11.jpg", "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_11.jpg", '', false, false, timestamp()),
                    Zuck.buildItem("thor-12", "photo", 3, "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_12.jpg", "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_12.jpg", '', false, false, timestamp()),
                    Zuck.buildItem("thor-13", "photo", 3, "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_13.jpg", "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_13.jpg", '', false, false, timestamp()),
                    Zuck.buildItem("thor-14", "photo", 3, "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_14.jpg", "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_14.jpg", '', false, false, timestamp()),
                    Zuck.buildItem("thor-15", "photo", 3, "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_15.jpg", "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_15.jpg", '', false, false, timestamp()),
                    Zuck.buildItem("thor-16", "photo", 3, "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_16.jpg", "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_16.jpg", '', false, false, timestamp()),
                    Zuck.buildItem("thor-17", "photo", 3, "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_17.jpg", "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_17.jpg", '', false, false, timestamp())
                ]
            },
            {
                id: "willy",
                photo: "https://www.mikeplanzer.ch/storyquiz/img/avatars/3_willsmith.jpg",
                name: "Willy",
                link: "",
                lastUpdated: timestamp(),
                items: [
                    Zuck.buildItem("thor-1", "photo", 3, "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_1.jpg", "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_1.jpg", '', false, false, timestamp()),
                    Zuck.buildItem("thor-2", "photo", 3, "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_2.jpg", "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_2.jpg", '', false, false, timestamp()),
                    Zuck.buildItem("thor-3", "photo", 3, "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_3.jpg", "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_3.jpg", '', false, false, timestamp()),
                    Zuck.buildItem("thor-4", "photo", 3, "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_4.jpg", "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_4.jpg", '', false, false, timestamp()),
                    Zuck.buildItem("thor-5", "photo", 3, "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_5.jpg", "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_5.jpg", '', false, false, timestamp()),
                    Zuck.buildItem("thor-6", "photo", 3, "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_6.jpg", "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_6.jpg", '', false, false, timestamp()),
                    Zuck.buildItem("thor-7", "photo", 3, "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_7.jpg", "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_7.jpg", '', false, false, timestamp()),
                    Zuck.buildItem("thor-8", "photo", 3, "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_8.jpg", "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_8.jpg", '', false, false, timestamp()),
                    Zuck.buildItem("thor-9", "photo", 3, "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_9.jpg", "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_9.jpg", '', false, false, timestamp()),
                    Zuck.buildItem("thor-10", "photo", 3, "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_10.jpg", "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_10.jpg", '', false, false, timestamp()),
                    Zuck.buildItem("thor-11", "photo", 3, "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_11.jpg", "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_11.jpg", '', false, false, timestamp()),
                    Zuck.buildItem("thor-12", "photo", 3, "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_12.jpg", "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_12.jpg", '', false, false, timestamp()),
                    Zuck.buildItem("thor-13", "photo", 3, "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_13.jpg", "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_13.jpg", '', false, false, timestamp()),
                    Zuck.buildItem("thor-14", "photo", 3, "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_14.jpg", "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_14.jpg", '', false, false, timestamp()),
                    Zuck.buildItem("thor-15", "photo", 3, "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_15.jpg", "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_15.jpg", '', false, false, timestamp()),
                    Zuck.buildItem("thor-16", "photo", 3, "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_16.jpg", "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_16.jpg", '', false, false, timestamp()),
                    Zuck.buildItem("thor-17", "photo", 3, "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_17.jpg", "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_17.jpg", '', false, false, timestamp())
                ]
            },
            {
                id: "loki",
                photo: "https://www.mikeplanzer.ch/storyquiz/img/avatars/4_loki.jpg",
                name: "Loki",
                link: "",
                lastUpdated: timestamp(),
                items: [
                    Zuck.buildItem("thor-1", "photo", 3, "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_1.jpg", "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_1.jpg", '', false, false, timestamp()),
                    Zuck.buildItem("thor-2", "photo", 3, "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_2.jpg", "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_2.jpg", '', false, false, timestamp()),
                    Zuck.buildItem("thor-3", "photo", 3, "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_3.jpg", "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_3.jpg", '', false, false, timestamp()),
                    Zuck.buildItem("thor-4", "photo", 3, "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_4.jpg", "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_4.jpg", '', false, false, timestamp()),
                    Zuck.buildItem("thor-5", "photo", 3, "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_5.jpg", "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_5.jpg", '', false, false, timestamp()),
                    Zuck.buildItem("thor-6", "photo", 3, "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_6.jpg", "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_6.jpg", '', false, false, timestamp()),
                    Zuck.buildItem("thor-7", "photo", 3, "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_7.jpg", "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_7.jpg", '', false, false, timestamp()),
                    Zuck.buildItem("thor-8", "photo", 3, "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_8.jpg", "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_8.jpg", '', false, false, timestamp()),
                    Zuck.buildItem("thor-9", "photo", 3, "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_9.jpg", "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_9.jpg", '', false, false, timestamp()),
                    Zuck.buildItem("thor-10", "photo", 3, "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_10.jpg", "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_10.jpg", '', false, false, timestamp()),
                    Zuck.buildItem("thor-11", "photo", 3, "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_11.jpg", "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_11.jpg", '', false, false, timestamp()),
                    Zuck.buildItem("thor-12", "photo", 3, "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_12.jpg", "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_12.jpg", '', false, false, timestamp()),
                    Zuck.buildItem("thor-13", "photo", 3, "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_13.jpg", "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_13.jpg", '', false, false, timestamp()),
                    Zuck.buildItem("thor-14", "photo", 3, "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_14.jpg", "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_14.jpg", '', false, false, timestamp()),
                    Zuck.buildItem("thor-15", "photo", 3, "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_15.jpg", "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_15.jpg", '', false, false, timestamp()),
                    Zuck.buildItem("thor-16", "photo", 3, "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_16.jpg", "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_16.jpg", '', false, false, timestamp()),
                    Zuck.buildItem("thor-17", "photo", 3, "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_17.jpg", "https://www.mikeplanzer.ch/storyquiz/img/story/Picture_17.jpg", '', false, false, timestamp())
                ]
            }
        ]
    });

    var el = document.querySelectorAll('#skin option');
    var total = el.length;
    for (var i = 0; i < total; i++) {
        var what = (skin == el[i].value) ? true : false;

        if (what) {
            el[i].setAttribute('selected', what);

            header.innerHTML = skin;
            header.className = skin;
        } else {
            el[i].removeAttribute('selected');
        }
    }

    document.body.style.display = 'block';
};

initDemo();