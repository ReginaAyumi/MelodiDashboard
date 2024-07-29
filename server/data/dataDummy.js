export const dataAdmin = [
    {
        adminId: "da1",
        name: "Ari FD",
        email: "swelbeck12@ycombinator.com",
        password: "Diraja04",
        city: "Jakarta",
        state: null,
        country: "Indonesia",
        occupation: "Operations Manager",
        phoneNumber: "7036619983",
        role: "superadmin",
    },
    {
        adminId: "da2",
        name: "Adit",
        email: "aweben13@feedburner.com",
        password: "GpOhlbh0G",
        city: "Semarang",
        state: null,
        country: "Indonesia",
        occupation: "Administrative Officer",
        phoneNumber: "4707334512",
        role: "admin",
    },
    {
        adminId: "da3",
        name: "Kevyn",
        email: "mdonlon1@hostgator.com",
        password: "XRYBnKAfm",
        city: "Pangkalan Bun",
        state: null,
        country: "Indonesia",
        occupation: "Event Coordinator",
        phoneNumber: "9981906117",
        role: "admin",
    },

];


export const dataVisitor = [
    { visitorId: 'dv1', ageGroup: '18-25', gender: 'Male', expression: 'Happy', race: 'Asian', luggage: 'Medium', time: new Date('2023-01-01T10:00:00Z') },
    { visitorId: 'dv2', ageGroup: '26-35', gender: 'Female', expression: 'Neutral', race: 'Caucasian', luggage: 'Small', time: new Date('2023-01-02T11:00:00Z') },
    { visitorId: 'dv3', ageGroup: '36-45', gender: 'Male', expression: 'Sad', race: 'African American', luggage: 'Large', time: new Date('2023-01-03T12:00:00Z') },
    { visitorId: 'dv4', ageGroup: '18-25', gender: 'Female', expression: 'Surprised', race: 'Hispanic', luggage: 'Small', time: new Date('2023-01-04T13:00:00Z') },
    { visitorId: 'dv5', ageGroup: '26-35', gender: 'Male', expression: 'Angry', race: 'Asian', luggage: 'Large', time: new Date('2023-01-05T14:00:00Z') },
    { visitorId: 'dv6', ageGroup: '36-45', gender: 'Female', expression: 'Happy', race: 'Caucasian', luggage: 'Medium', time: new Date('2023-01-06T15:00:00Z') },
    { visitorId: 'dv7', ageGroup: '46-55', gender: 'Male', expression: 'Neutral', race: 'African American', luggage: 'Large', time: new Date('2023-01-07T16:00:00Z') },
    { visitorId: 'dv8', ageGroup: '18-25', gender: 'Female', expression: 'Sad', race: 'Hispanic', luggage: 'Medium', time: new Date('2023-01-08T17:00:00Z') },
    { visitorId: 'dv9', ageGroup: '26-35', gender: 'Male', expression: 'Surprised', race: 'Asian', luggage: 'Small', time: new Date('2023-01-09T18:00:00Z') },
    { visitorId: 'dv10', ageGroup: '36-45', gender: 'Female', expression: 'Angry', race: 'Caucasian', luggage: 'Large', time: new Date('2023-01-10T19:00:00Z') },
];



export const dataFeedback = [
    {feedbackId: 'df1', feedbackDate:	"2024-05-01", feedbackContent:"Layanannya bagus banget.", rating: 5, visitorId: "dv1" },
    {feedbackId: 'df2', feedbackDate:	"2024-05-01", feedbackContent:"Hewannya banyak.", rating: 4, visitorId: "dv2" },
    {feedbackId: 'df3', feedbackDate:	"2024-05-02", feedbackContent:"Biasa aja sih.", rating: 3, visitorId: "dv3" },
    {feedbackId: 'df4', feedbackDate:	"2024-05-03", feedbackContent:"Keren ada robotnya.", rating: 4, visitorId: "dv4" },
    {feedbackId: 'df5', feedbackDate:	"2024-05-03", feedbackContent:"Pengalaman yang mengecewakan.", rating: 1, visitorId: "dv5" },
    {feedbackId: 'df6', feedbackDate:	"2024-05-05", feedbackContent:"Hewannya kurang bervariasi.", rating: 2, visitorId: "dv6" },
    {feedbackId: 'df7', feedbackDate:	"2024-05-05", feedbackContent:"Agak jauh antara hewan yang satu dengan lainnya.", rating: 2, visitorId: "dv7" },
    {feedbackId: 'df8', feedbackDate:	"2024-05-05", feedbackContent:"Keren ada hewan eksotiknya.", rating: 4, visitorId: "dv8" },
    {feedbackId: 'df9', feedbackDate:	"2024-05-05", feedbackContent:"Lumayan lah ya.", rating: 3, visitorId: "9" },
    {feedbackId: 'df10', feedbackDate:	"2024-05-05", feedbackContent:"Bagus sih.", rating: 4, visitorId: "dv10" },
]

export const dataClickStream = [
    {
        clickstreamId: 'dc1',
        VisitorId: 'dv1',
        clicks: [
            { visited_url: '/animals', clickDate: '2024-06-01T08:25:00Z' },
            { visited_url: '/animals/detail/2', clickDate: '2024-06-01T08:30:50Z' },
            { visited_url: '/animals/feedback', clickDate: '2024-06-01T08:45:50Z' },
        ]
    },
    {
        clickstreamId: 'dc2',
        VisitorId: 'dv2',
        clicks: [
            { visited_url: '/maps', clickDate: '2024-06-01T13:30:00Z' },
            { visited_url: '/maps/detail/2', clickDate: '2024-06-01T13:30:00Z' },
            { visited_url: '/feedback', clickDate: '2024-06-01T13:32:00Z' },
        ]
    },
    {
        clickstreamId: 'dc3',
        VisitorId: 'dv3',
        clicks: [
            { visited_url: '/public-facilities', clickDate: '2024-06-02T10:00:00Z' },
            { visited_url: '/public-facilities/detail/5', clickDate: '2024-06-02T12:30:00Z' },
            { visited_url: '/public-facilities/detail/3', clickDate: '2024-06-03T15:15:00Z' },
            { visited_url: '/public-facilities/feedback', clickDate: '2024-06-02T18:45:00Z' }
        ]
    },
    {
        clickstreamId: 'dc4',
        VisitorId: 'dv4',
        clicks: [
            { visited_url: '/food-store', clickDate: '2024-06-03T08:30:00Z' },
            { visited_url: '/food-store/feedback', clickDate: '2024-06-03T11:00:00Z' },
        ]
    },
    {
        clickstreamId: 'dc5',
        VisitorId: 'dv5',
        clicks: [
            { visited_url: '/animals', clickDate: '2024-06-03T09:45:00Z' },
            { visited_url: '/feedback', clickDate: '2024-06-03T13:15:00Z' },
        ]
    },
    {
        clickstreamId: 'dc6',
        VisitorId: 'dv6',
        clicks: [
            { visited_url: '/feedback', clickDate: '2024-06-05T08:30:00Z' },
        ]
    },
    {
        clickstreamId: 'dc7',
        VisitorId: 'dv7',
        clicks: [
            { visited_url: '/food-store/', clickDate: '2024-06-05T09:00:00Z' },
            { visited_url: '/food-store/detail/2', clickDate: '2024-06-05T12:00:00Z' },
            { visited_url: '/food-store/detail/4', clickDate: '2024-06-05T14:30:00Z' },
            { visited_url: '/food-store/feedback', clickDate: '2024-06-05T17:15:00Z' }
        ]
    },
    {
        clickstreamId: 'dc8',
        VisitorId: 'dv8',
        clicks: [
            { visited_url: '/public-facilities', clickDate: '2024-06-05T08:45:00Z' },
            { visited_url: '/public-facilities/detail/6', clickDate: '2024-06-05T11:30:00Z' },
            { visited_url: '/feedback', clickDate: '2024-06-05T14:00:00Z' },
        ]
    },
    {
        clickstreamId: 'dc9',
        VisitorId: 'dv9',
        clicks: [
            { visited_url: '/feedback', clickDate: '2024-06-05T09:30:00Z' },
        ]
    },
    {
        clickstreamId: 'dc10',
        VisitorId: 'dv10',
        clicks: [
            { visited_url: '/animals', clickDate: '2024-06-05T08:00:00Z' },
            { visited_url: '/animals/detail/1', clickDate: '2024-06-05T11:30:00Z' },
            { visited_url: '/animals/detail/2', clickDate: '2024-06-05T14:15:00Z' },
            { visited_url: '/animals/feedback', clickDate: '2024-06-05T16:30:00Z' }
        ]
    }
];


export const overallStats = [
    { _id: 'os1', totalVisitors: 150, overallFeedback: 'Positive', mostClicked: 'HomePage', adminId: 'ua1' },
    { _id: 'os2', totalVisitors: 200, overallFeedback: 'Mixed', mostClicked: 'ContactPage', adminId: 'ua2' },
    { _id: 'os3', totalVisitors: 250, overallFeedback: 'Positive', mostClicked: 'ServicesPage', adminId: 'ua3' },
    { _id: 'os4', totalVisitors: 300, overallFeedback: 'Negative', mostClicked: 'AboutPage', adminId: 'ua1' },
    { _id: 'os5', totalVisitors: 350, overallFeedback: 'Positive', mostClicked: 'HomePage', adminId: 'ua2' },
    { _id: 'os6', totalVisitors: 400, overallFeedback: 'Mixed', mostClicked: 'ContactPage', adminId: 'ua3' },
    { _id: 'os7', totalVisitors: 450, overallFeedback: 'Positive', mostClicked: 'ServicesPage', adminId: 'ua1' },
    { _id: 'os8', totalVisitors: 500, overallFeedback: 'Negative', mostClicked: 'AboutPage', adminId: 'ua2' },
    { _id: 'os9', totalVisitors: 550, overallFeedback: 'Positive', mostClicked: 'HomePage', adminId: 'ua3' },
    { _id: 'os10', totalVisitors: 600, overallFeedback: 'Mixed', mostClicked: 'ContactPage', adminId: 'ua1' },
];

export const userInteractions = [
    { _id: 'ui1', feedback: 'Great service!', clickstream: null, userId: 'vd1', adminId: 'ua1' },
    { _id: 'ui2', feedback: null, clickstream: 'Page1 -> Page2 -> Page3', userId: 'vd2', adminId: 'ua2' },
    { _id: 'ui3', feedback: 'Could be better.', clickstream: null, userId: 'vd3', adminId: 'ua3' },
    { _id: 'ui4', feedback: null, clickstream: 'Page3 -> Page4', userId: 'vd4', adminId: 'ua1' },
    { _id: 'ui5', feedback: 'I love it!', clickstream: null, userId: 'vd5', adminId: 'ua2' },
    { _id: 'ui6', feedback: null, clickstream: 'Page2 -> Page5 -> Page6', userId: 'vd6', adminId: 'ua3' },
    { _id: 'ui7', feedback: 'Not satisfied.', clickstream: null, userId: 'vd7', adminId: 'ua1' },
    { _id: 'ui8', feedback: null, clickstream: 'Page5 -> Page1', userId: 'vd8', adminId: 'ua2' },
    { _id: 'ui9', feedback: 'Amazing experience!', clickstream: null, userId: 'vd9', adminId: 'ua3' },
    { _id: 'ui10', feedback: null, clickstream: 'Page4 -> Page3 -> Page2', userId: 'vd10', adminId: 'ua1' }
];