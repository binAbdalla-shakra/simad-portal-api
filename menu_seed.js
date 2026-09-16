require('dotenv').config();

const mongoose = require('mongoose');
const connectDB = require('./src/Admin/config/db');
const Menu = require('./src/models/Menu.model');

// Mirrors src/Layouts/LayoutMenuData.js on the frontend so Role permission
// assignment (settings/Roles) and sidebar filtering have real Menu documents
// to work with.
const structure = [
    { label: 'Dashboard', icon: 'ri-dashboard-2-line', link: '/dashboard', order: 0 },
    { label: 'Reports', icon: 'ri-bar-chart-2-line', link: '/reports', order: 1 },
    {
        label: 'Academic Structure', icon: 'ri-graduation-cap-line', link: '/#', order: 2,
        children: [
            { label: 'Program Categories', link: '/setup/parogram-categories' },
            { label: 'Schools & Faculties', link: '/setup/schools' },
            { label: 'Programs', link: '/setup/programs' },
            { label: 'Institutions', link: '/setup/institutions' },
        ]
    },
    {
        label: 'People & Partnerships', icon: 'ri-building-line', link: '/#', order: 3,
        children: [
            { label: 'Staff Directory', link: '/setup/staffs' },
            { label: 'Partner Categories', link: '/setup/partner-categories' },
            { label: 'External Partners', link: '/setup/partners' },
        ]
    },
    {
        label: 'Media & Campus Life', icon: 'ri-file-list-3-line', link: '/#', order: 4,
        children: [
            { label: 'Events', link: '/content/events' },
            { label: 'News & Announcements', link: '/content/news' },
            { label: 'Campus Facilities', link: '/content/facilities' },
        ]
    },
    {
        label: 'Access Control', icon: 'ri-team-line', link: '/#', order: 5,
        children: [
            { label: 'User Accounts', link: '/setting-users' },
            { label: 'Roles & Permissions', link: '/setting-roles' },
        ]
    },
    {
        label: 'University Profile', icon: 'ri-settings-3-line', link: '/#', order: 6,
        children: [
            { label: 'Overview', link: '/setting-profile' },
            { label: 'University Info', link: '/setting-university' },
            { label: 'Senate', link: '/setting-senate' },
            { label: 'Our History', link: '/setting/history' },
            { label: 'Why SIMAD?', link: '/setting/why-simad' },
            { label: 'Accreditations', link: '/setting-accreditations' },
        ]
    },
];

async function upsertMenu(data) {
    return Menu.findOneAndUpdate(
        { link: data.link, parentId: data.parentId || null },
        { $set: data },
        { upsert: true, new: true, setDefaultsOnInsert: true }
    );
}

async function seedMenus() {
    await connectDB();

    for (const section of structure) {
        const { children, ...parentData } = section;
        const parent = await upsertMenu({ ...parentData, createdBy: 'menu_seed.js' });
        console.log(`Menu ready: ${parent.label}`);

        if (children) {
            let order = 0;
            for (const child of children) {
                await upsertMenu({
                    ...child,
                    icon: undefined,
                    parentId: parent._id,
                    order: order++,
                    createdBy: 'menu_seed.js'
                });
            }
            console.log(`  -> ${children.length} sub-menu(s) ready`);
        }
    }
}

seedMenus()
    .catch((error) => {
        console.error('Menu seed failed:', error.message);
        process.exitCode = 1;
    })
    .finally(async () => {
        await mongoose.disconnect();
    });
