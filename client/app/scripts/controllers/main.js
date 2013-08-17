'use strict';

function TopicListCtrl($scope) {
    $scope.topics = [
        {
            id: 1000,
            title: "The Next, Next Generation(Honeycomb).",
            created_at: 1376712096,
            founder: 'Emrys',
            profileImg: 'http://tp1.sinaimg.cn/2972287924/180/40002983278/1',
            description: "The Next, Next Generation\r\n\r\nExperience the future with Motorola XOOM with Wi-Fi, the world's first tablet powered by Android 3.0 (Honeycomb).",
            particpantCount: 10,
            replyCount: 'Fast just got faster with Nexus S.'
        },
        {
            id: 1001,
            title: 'motorola-xoom-with-wi-fi',
            created_at: 1376712096,
            founder: 'Emrys',
            profileImg: 'http://tp3.sinaimg.cn/2909224002/50/40004751548/0',
            description: "The Next, Next Generation\n\nExperience the future with MOTOROLA XOOM, the world's first tablet powered by Android 3.0 (Honeycomb).",
            particpantCount: 10,
            replyCount: 'Fast just got faster with Nexus S.'
        },
        {
            id: 1002,
            title: 'motorola-xoom',
            created_at: 1376712096,
            founder: 'Emrys',
            profileImg: 'http://tp3.sinaimg.cn/1894238970/50/40001212534/1',
            description: "MOTOROLA ATRIX 4G the world's most powerful smartphone.",
            particpantCount: 10,
            replyCount: 'Fast just got faster with Nexus S.'
        },
        {
            id: 1003,
            title: 'AT&amp;T',
            created_at: 1376712096,
            founder: 'Emrys',
            profileImg: 'http://tp4.sinaimg.cn/2745813247/50/5662511969/1',
            description: "Introducing Dell\u2122 Streak 7. Share photos, videos and movies together. It\u2019s small enough to carry around, big enough to gather around.",
            particpantCount: 10,
            replyCount: 'Fast just got faster with Nexus S.'
        },
        {
            id: 1003,
            title: 'dell-streak-7',
            created_at: 1376712096,
            founder: 'Emrys',
            profileImg: 'http://tp2.sinaimg.cn/2091571657/50/40012175680/1',
            description: "The Samsung Gem\u2122 brings you everything that you would expect and more from a touch display smart phone \u2013 more apps, more features and a more affordable price.",
            particpantCount: 10,
            replyCount: 'Fast just got faster with Nexus S.'
        },
        {
            id: 1003,
            title: 'samsung-gem',
            created_at: 1376712096,
            founder: 'Emrys',
            profileImg: 'http://tp1.sinaimg.cn/1619185424/50/5615533912/1',
            description: "Android Powered, Google Maps Navigation, 5 Customizable Home Screens",
            particpantCount: 10,
            replyCount: 'Fast just got faster with Nexus S.'
        },
        {
            id: 1003,
            title: 'dell-venue',
            created_at: 1376712096,
            founder: 'Emrys',
            profileImg: 'http://tp3.sinaimg.cn/1660716210/50/5669280851/1',
            description: "Feel Free to Tab\u2122. The Samsung Galaxy Tab\u2122 brings you an ultra-mobile entertainment experience through its 7\u201d display, high-power processor and Adobe\u00ae Flash\u00ae Player compatibility.",
            particpantCount: 10,
            replyCount: 'Fast just got faster with Nexus S.'
        },
        {
            id: 1003,
            title: 'nexus-s',
            created_at: 1376712096,
            founder: 'Emrys',
            profileImg: 'http://tp2.sinaimg.cn/1228923613/50/5670812237/0',
            description: "The Samsung Showcase\u2122 delivers a cinema quality experience like you\u2019ve never seen before. Its innovative 4\u201d touch display technology provides rich picture brilliance, even outdoors",
            particpantCount: 10,
            replyCount: 'Fast just got faster with Nexus S.'
        },
        {
            id: 1003,
            title: 'Cellular South',
            created_at: 1376712096,
            founder: 'Emrys',
            profileImg: 'http://tp3.sinaimg.cn/1644867970/50/5635257390/1',
            description: "The first smartphone with a 1.2 GHz processor and global capabilities.",
            particpantCount: 10,
            replyCount: 'Fast just got faster with Nexus S.'
        },
        {
            id: 1003,
            title: 'Samsung Galaxy Tab\u2122',
            created_at: 1376712096,
            founder: 'Emrys',
            profileImg: 'http://tp4.sinaimg.cn/1819503815/50/1284790410/1',
            description: "The next generation of DOES.",
            particpantCount: 10,
            replyCount: 'Fast just got faster with Nexus S.'
        },
        {
            id: 1003,
            title: 'Cellular South',
            created_at: 1376712096,
            founder: 'Emrys',
            profileImg: 'http://tp2.sinaimg.cn/2783938821/50/40022637522/1',
            description: "An experience to cheer about.",
            particpantCount: 10,
            replyCount: 'Fast just got faster with Nexus S.'
        },
        {
            id: 1003,
            title: 'Verizon',
            created_at: 1376712096,
            founder: 'Emrys',
            profileImg: 'http://tp1.sinaimg.cn/1645338100/50/40030050161/1',
            description: "Are you ready for everything life throws your way?",
            particpantCount: 10,
            replyCount: 'Fast just got faster with Nexus S.'
        },
        {
            id: 1003,
            title: 'Nexus S',
            created_at: 1376712096,
            founder: 'Emrys',
            profileImg: 'http://tp4.sinaimg.cn/1707085527/50/5630991334/1',
            description: "The T-Mobile myTouch 4G is a premium smartphone designed to deliver blazing fast 4G speeds so that you can video chat from practically anywhere, with or without Wi-Fi.",
            particpantCount: 10,
            replyCount: 'Fast just got faster with Nexus S.'
        },
        {
            id: 1003,
            title: 'Nexus S',
            created_at: 1376712096,
            founder: 'Emrys',
            profileImg: 'http://tp3.sinaimg.cn/2200396182/50/5604199423/1',
            description: "The Samsung Mesmerize\u2122 delivers a cinema quality experience like you\u2019ve never seen before. Its innovative 4\u201d touch display technology provides rich picture brilliance,even outdoors",
            particpantCount: 10,
            replyCount: 'Fast just got faster with Nexus S.'
        },
        {
            id: 1003,
            title: 'Nexus S',
            created_at: 1376712096,
            founder: 'Emrys',
            profileImg: 'http://tp2.sinaimg.cn/2661275881/50/5635817434/1',
            description: "The Sanyo Zio by Kyocera is an Android smartphone with a combination of ultra-sleek styling, strong performance and unprecedented value.",
            particpantCount: 10,
            replyCount: 'Fast just got faster with Nexus S.'
        },
        {
            id: 1003,
            title: 'Nexus S',
            created_at: 1376712096,
            founder: 'Emrys',
            profileImg: 'http://tp4.sinaimg.cn/1652595727/50/1279883914/1',
            description: "The Samsung Transform\u2122 brings you a fun way to customize your Android powered touch screen phone to just the way you like it through your favorite themed \u201cSprint ID Service Pack\u201d.",
            particpantCount: 10,
            replyCount: 'Fast just got faster with Nexus S.'
        },
        {
            id: 1003,
            title: 'Nexus S',
            created_at: 1376712096,
            founder: 'Emrys',
            profileImg: 'http://tp2.sinaimg.cn/2357213493/50/40023134783/1',
            description: "The T-Mobile G2 with Google is the first smartphone built for 4G speeds on T-Mobile's new network. Get the information you need, faster than you ever thought possible.",
            particpantCount: 10,
            replyCount: 'Fast just got faster with Nexus S.'
        },
        {
            id: 1003,
            title: 'Nexus S',
            created_at: 1376712096,
            founder: 'Emrys',
            profileImg: 'http://tp2.sinaimg.cn/1751201045/50/1279901750/1',
            description: "Motorola CHARM fits easily in your pocket or palm.  Includes MOTOBLUR service.",
            particpantCount: 10,
            replyCount: 'Fast just got faster with Nexus S.'
        },
    ];

    $scope.topicDetail = {
            id: 1000,
            title: "The Next, Next Generation(Honeycomb).",
            created_at: 1376712096,
            founder: 'Emrys',
            profileImg: 'http://tp1.sinaimg.cn/2972287924/180/40002983278/1',
            description: "The Next, Next Generation\r\n\r\nExperience the future with Motorola XOOM with Wi-Fi, the world's first tablet powered by Android 3.0 (Honeycomb).",
            particpantCount: 10,
            replyCount: 'Fast just got faster with Nexus S.'
    };

    $scope.setDetail = function(topicId) {
        $scope.topicDetail = {
            id: topicId,
            title: "The Next, Next Generation(Honeycomb).",
            created_at: 1376712096,
            founder: 'Emrys',
            profileImg: 'http://tp1.sinaimg.cn/2972287924/180/40002983278/1',
            description: "The Next, Next Generation\r\n\r\nExperience the future with Motorola XOOM with Wi-Fi, the world's first tablet powered by Android 3.0 (Honeycomb).",
            particpantCount: 10,
            replyCount: 'Fast just got faster with Nexus S.',
            hardware: {
                accelerometer: true, 
                audioJack: "3.5mm", 
                cpu: "1GHz Cortex A8 (Hummingbird) processor", 
                fmRadio: false, 
                physicalKeyboard: false, 
                usb: "USB 2.0"
            } 
        };
    };
};

function TopicDetailCtrl($scope, $routeParams) {
    $scope.phone = {
    "additionalFeatures": "Gorilla Glass display, Dedicated Camera Key, Ring Silence Switch, Swype keyboard.", 
        "android": {
            "os": "Android 2.2", 
            "ui": "Dell Stage"
        }, 
        "availability": [
            "AT&amp;T,", 
            "KT,", 
            "T-Mobile"
        ], 
        "battery": {
            "standbyTime": "400 hours", 
            "talkTime": "7 hours", 
            "type": "Lithium Ion (Li-Ion) (1400 mAH)"
        }, 
        "camera": {
            "features": [
                "Flash", 
                "Video"
            ], 
            "primary": "8.0 megapixels"
        }, 
        "connectivity": {
            "bluetooth": "Bluetooth 2.1", 
            "cell": "850/1900/2100 3G; 850/900/1800/1900 GSM/GPRS/EDGE\n900/1700/2100 3G; 850/900/1800/1900 GSM/GPRS/EDGE", 
            "gps": true, 
            "infrared": false, 
            "wifi": "802.11 b/g/n"
        }, 
        "description": "The Venue is the perfect one-touch, Smart Phone providing instant access to everything you love. All of Venue's features make it perfect for on-the-go students, mobile professionals, and active social communicators who love style and performance.\n\nElegantly designed, the Venue offers a vibrant, curved glass display that\u2019s perfect for viewing all types of content. The Venue\u2019s slender form factor feels great in your hand and also slips easily into your pocket.  A mobile entertainment powerhouse that lets you download the latest tunes from Amazon MP3 or books from Kindle, watch video, or stream your favorite radio stations.  All on the go, anytime, anywhere.", 
        "display": {
            "screenResolution": "WVGA (800 x 480)", 
            "screenSize": "4.1 inches", 
            "touchScreen": true
        }, 
        "hardware": {
            "accelerometer": true, 
            "audioJack": "3.5mm", 
            "cpu": "1 Ghz processor", 
            "fmRadio": false, 
            "physicalKeyboard": false, 
            "usb": "USB 2.0"
        }, 
        "id": "dell-venue", 
        "images": [
            "img/phones/dell-venue.0.jpg", 
            "img/phones/dell-venue.1.jpg", 
            "img/phones/dell-venue.2.jpg", 
            "img/phones/dell-venue.3.jpg", 
            "img/phones/dell-venue.4.jpg", 
            "img/phones/dell-venue.5.jpg"
        ], 
        "name": "Dell Venue", 
        "sizeAndWeight": {
            "dimensions": [
                "64.0 mm (w)", 
                "121.0 mm (h)", 
                "12.9 mm (d)"
            ], 
            "weight": "164.0 grams"
        }, 
        "storage": {
            "flash": "1000MB", 
            "ram": "512MB"
        }
    };

    $scope.mainImageUrl = $scope.phone.images[0];
}
