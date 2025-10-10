const { successResponse, errorResponse } = require('../../utils/response');



exports.getinstiutionsStaticInfo = async (req, res) => {
    try {
        const instituionsSummary = [
            {
                id: '1',
                name: 'Center for Graduate Studies',
                image: 'https://gs.simad.edu.so/wp-content/uploads/2025/08/SU_Faculty_Marks_GS_-01-1536x718.png',
                description: 'A hub for advanced academic programs, research, and postgraduate education excellence.'
            },
            {
                id: '2',
                name: 'SIMAD Innovation Lab',
                image: 'https://simad.edu.so/_next/image?url=https%3A%2F%2Fdirectus.simad.edu.so%2Fassets%2Fb7090290-5877-4518-adfd-2e650d6b1d29&w=384&q=75',
                description: 'A creative space fostering innovation, entrepreneurship, and technology-driven solutions.'
            },
            {
                id: '3',
                name: 'SIMAD Fabrication Lab',
                image: 'https://simad.edu.so/_next/image?url=https%3A%2F%2Fdirectus.simad.edu.so%2Fassets%2Fb6bcdb40-5ba0-4fb4-8b00-f04f258f3523&w=384&q=75',
                description: 'A hands-on maker space equipped with tools for prototyping, design, and digital fabrication.'
            },
            {
                id: '4',
                name: 'Institute of Modern Languages (IML)',
                image: 'https://iml.simad.edu.so/wp-content/uploads/2025/05/SU_Center_Mark_IML_-01.png',
                description: 'Dedicated to teaching and promoting foreign languages, translation, and intercultural studies.'
            },
            {
                id: '5',
                name: 'Research Center',
                image: 'https://simad.edu.so/_next/image?url=https%3A%2F%2Fdirectus.simad.edu.so%2Fassets%2F34110e56-d354-4e32-a746-c0b89e4d2e4d&w=384&q=75',
                description: 'Conducts multidisciplinary research projects contributing to knowledge and innovation.'
            },
            {
                id: '6',
                name: 'Smart Classes',
                image: '../assets/images/smartclasses.jpg',
                description: 'Modern digital classrooms integrating technology to enhance the learning experience.'
            },
        ];

        return successResponse(res, { instituionsSummary });
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};
