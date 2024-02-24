import React from 'react';
const columns = [
    { name: 'NAME', uid: 'name' },
    { name: 'ROLE', uid: 'role' },
    { name: 'STATUS', uid: 'status' },
    { name: 'ACTIONS', uid: 'actions' },
];

const users = [
    {
        id: 1,
        name: 'Anakin Skywalker',
        role: 'Jedi Knight',
        team: 'Jedi',
        status: 'active',
        age: '23',
        avatar: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fdisney.fandom.com%2Fwiki%2FAnakin_Skywalker&psig=AOvVaw2ySCauRIPBfDR57NHeVNJH&ust=1708477158192000&source=images&cd=vfe&opi=89978449&ved=0CBMQjRxqFwoTCIj0uMPbuIQDFQAAAAAdAAAAABAE',
        email: 'tony.reichert@example.com',
        socials: {
            linkedin: 'https://www.linkedin.com/',
            github: 'https://github.com/',
        },
    },
    {
        id: 2,
        name: 'Zoey Lang',
        role: 'Technical Lead',
        team: 'Development',
        status: 'paused',
        age: '25',
        avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
        email: 'zoey.lang@example.com',
        socials: {
            linkedin: 'https://www.linkedin.com/',
            github: 'https://github.com/',
        },
    },
    {
        id: 3,
        name: 'Jane Fisher',
        role: 'Senior Developer',
        team: 'Development',
        status: 'active',
        age: '22',
        avatar: 'https://i.pravatar.cc/150?u=a04258114e29026702d',
        email: 'jane.fisher@example.com',
        socials: {
            linkedin: 'https://www.linkedin.com/',
            github: 'https://github.com/',
        },
    },
    {
        id: 4,
        name: 'William Howard',
        role: 'Community Manager',
        team: 'Marketing',
        status: 'vacation',
        age: '28',
        avatar: 'https://i.pravatar.cc/150?u=a048581f4e29026701d',
        email: 'william.howard@example.com',
        socials: {
            linkedin: 'https://www.linkedin.com/',
            github: 'https://github.com/',
        },
    },
    {
        id: 5,
        name: 'Kristen Copper',
        role: 'Sales Manager',
        team: 'Sales',
        status: 'active',
        age: '24',
        avatar: 'https://i.pravatar.cc/150?u=a092581d4ef9026700d',
        email: 'kristen.cooper@example.com',
        socials: {
            linkedin: 'https://www.linkedin.com/',
            github: 'https://github.com/',
        },
    },
];

export { columns, users };
