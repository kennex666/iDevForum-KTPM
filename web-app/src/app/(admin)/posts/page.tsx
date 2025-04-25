import React from 'react';
import Sidebar from '@/components/admin/Sidebar';
import Navbar from '@/components/admin/Navbar';
import Table from '@/components/admin/Table';

const ManageUser = () => {
    const employees = [
        {
            name: 'Airi Satou',
            position: 'Accountant',
            office: 'Tokyo',
            age: 33,
            startDate: '2008/11/28',
            salary: '$162,700',
            avatar: 'assets/img/avatars/avatar1.jpeg',
        },
        {
            name: 'Angelica Ramos',
            position: 'Chief Executive Officer(CEO)',
            office: 'London',
            age: 47,
            startDate: '2009/10/09',
            salary: '$1,200,000',
            avatar: 'assets/img/avatars/avatar2.jpeg',
        },
        {
            name: 'Ashton Cox',
            position: 'Junior Technical Author',
            office: 'San Francisco',
            age: 66,
            startDate: '2009/01/12',
            salary: '$86,000',
            avatar: 'assets/img/avatars/avatar3.jpeg',
        },
        {
            name: 'Bradley Greer',
            position: 'Software Engineer',
            office: 'London',
            age: 41,
            startDate: '2012/10/13',
            salary: '$132,000',
            avatar: 'assets/img/avatars/avatar4.jpeg',
        },
        {
            name: 'Brenden Wagner',
            position: 'Software Engineer',
            office: 'San Francisco',
            age: 28,
            startDate: '2011/06/07',
            salary: '$206,850',
            avatar: 'assets/img/avatars/avatar5.jpeg',
        },
        {
            name: 'Brielle Williamson',
            position: 'Integration Specialist',
            office: 'New York',
            age: 61,
            startDate: '2012/12/02',
            salary: '$372,000',
            avatar: 'assets/img/avatars/avatar1.jpeg',
        },
        {
            name: 'Bruno Nash',
            position: 'Software Engineer',
            office: 'London',
            age: 38,
            startDate: '2011/05/03',
            salary: '$163,500',
            avatar: 'assets/img/avatars/avatar2.jpeg',
        },
        {
            name: 'Caesar Vance',
            position: 'Pre-Sales Support',
            office: 'New York',
            age: 21,
            startDate: '2011/12/12',
            salary: '$106,450',
            avatar: 'assets/img/avatars/avatar3.jpeg',
        },
        {
            name: 'Cara Stevens',
            position: 'Sales Assistant',
            office: 'New York',
            age: 46,
            startDate: '2011/12/06',
            salary: '$145,600',
            avatar: 'assets/img/avatars/avatar4.jpeg',
        },
        {
            name: 'Cedric Kelly',
            position: 'Senior JavaScript Developer',
            office: 'Edinburgh',
            age: 22,
            startDate: '2012/03/29',
            salary: '$433,060',
            avatar: 'assets/img/avatars/avatar5.jpeg',
        },
    ];
    return (
        <div id="wrapper">
            <div id="content-wrapper" className="d-flex flex-column">
                <div id="content">
                    <div className="container-fluid">
                        <h3 className="text-dark mb-4">Team</h3>
                        <Table employees={employees} />
                    </div>
                </div>
                <footer className="bg-white sticky-footer">
                    <div className="container my-auto">
                        <div className="text-center my-auto copyright">
                            <span>Copyright © iDev4rum 2024</span>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default ManageUser;