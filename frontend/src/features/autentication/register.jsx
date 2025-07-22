import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDarkMode } from '../../contexts/DarkModeContext';
const bangladeshData = [
    {
        "division": "Barishal",
        "districts": [
            { "district": "Barguna", "upazilas": ["Amtali", "Bamna", "Barguna Sadar", "Betagi", "Patharghata", "Taltali"] },
            { "district": "Barishal", "upazilas": ["Agailjhara", "Babuganj", "Bakerganj", "Banaripara", "Gaurnadi", "Hizla", "Barishal Sadar", "Mehendiganj", "Muladi", "Wazirpur"] },
            { "district": "Bhola", "upazilas": ["Bhola Sadar", "Burhanuddin", "Char Fasson", "Daulatkhan", "Lalmohan", "Manpura", "Tazumuddin"] },
            { "district": "Jhalokati", "upazilas": ["Jhalokati Sadar", "Kathalia", "Nalchity", "Rajapur"] },
            { "district": "Patuakhali", "upazilas": ["Bauphal", "Dashmina", "Galachipa", "Kalapara", "Mirzaganj", "Patuakhali Sadar", "Rangabali", "Dumki"] },
            { "district": "Pirojpur", "upazilas": ["Bhandaria", "Kawkhali", "Mathbaria", "Nazirpur", "Pirojpur Sadar", "Nesarabad (Swarupkathi)", "Zianagar"] }
        ]
    },
    {
        "division": "Chattogram",
        "districts": [
            { "district": "Bandarban", "upazilas": ["Alikadam", "Bandarban Sadar", "Lama", "Naikhongchhari", "Rowangchhari", "Ruma", "Thanchi"] },
            { "district": "Brahmanbaria", "upazilas": ["Akhaura", "Bancharampur", "Brahmanbaria Sadar", "Kasba", "Nabinagar", "Nasirnagar", "Sarail", "Ashuganj", "Bijoynagar"] },
            { "district": "Chandpur", "upazilas": ["Chandpur Sadar", "Faridganj", "Haimchar", "Haziganj", "Kachua", "Matlab Dakshin", "Matlab Uttar", "Shahrasti"] },
            { "district": "Chattogram", "upazilas": ["Anwara", "Banshkhali", "Boalkhali", "Chandanaish", "Fatikchhari", "Hathazari", "Karnaphuli", "Lohagara", "Mirsharai", "Patiya", "Rangunia", "Raozan", "Sandwip", "Satkania", "Sitakunda"] },
            { "district": "Cox's Bazar", "upazilas": ["Chakaria", "Cox's Bazar Sadar", "Kutubdia", "Maheshkhali", "Pekua", "Ramu", "Teknaf", "Ukhia"] },
            { "district": "Cumilla", "upazilas": ["Barura", "Brahmanpara", "Burichang", "Chandina", "Chauddagram", "Daudkandi", "Debidwar", "Homna", "Laksam", "Monohorgonj", "Meghna", "Muradnagar", "Nangalkot", "Cumilla Sadar Dakshin", "Titas"] },
            { "district": "Feni", "upazilas": ["Chhagalnaiya", "Daganbhuiyan", "Feni Sadar", "Parshuram", "Sonagazi", "Fulgazi"] },
            { "district": "Khagrachhari", "upazilas": ["Dighinala", "Khagrachhari", "Lakshmichhari", "Mahalchhari", "Manikchhari", "Matiranga", "Panchhari", "Ramgarh"] },
            { "district": "Lakshmipur", "upazilas": ["Lakshmipur Sadar", "Raipur", "Ramganj", "Ramgati", "Kamalnagar"] },
            { "district": "Noakhali", "upazilas": ["Begumganj", "Noakhali Sadar", "Chatkhil", "Companiesgonj", "Hatiya", "Kabirhat", "Senbagh", "Sonaimuri", "Subarnachar"] },
            { "district": "Rangamati", "upazilas": ["Bagaichhari", "Barkal", "Kawkhali (Betbunia)", "Belaichhari", "Kaptai", "Juraichhari", "Langadu", "Naniarchar", "Rajasthali", "Rangamati Sadar"] }
        ]
    },
    {
        "division": "Dhaka",
        "districts": [
            { "district": "Dhaka", "upazilas": ["Dhamrai", "Dohar", "Keraniganj", "Nawabganj", "Savar"] },
            { "district": "Faridpur", "upazilas": ["Alfadanga", "Bhanga", "Boalmari", "Charbhadrasan", "Faridpur Sadar", "Madhukhali", "Nagarkanda", "Sadarpur", "Saltha"] },
            { "district": "Gazipur", "upazilas": ["Gazipur Sadar", "Kaliakair", "Kaliganj", "Kapasia", "Sreepur"] },
            { "district": "Gopalganj", "upazilas": ["Gopalganj Sadar", "Kashiani", "Kotalipara", "Muksudpur", "Tungipara"] },
            { "district": "Kishoreganj", "upazilas": ["Austagram", "Bajitpur", "Bhairab", "Hossainpur", "Itna", "Karimganj", "Katiadi", "Kishoreganj Sadar", "Kuliarchar", "Mithamain", "Nikli", "Pakundia", "Tarail"] },
            { "district": "Madaripur", "upazilas": ["Rajoir", "Madaripur Sadar", "Kalkini", "Shibchar"] },
            { "district": "Manikganj", "upazilas": ["Daulatpur", "Ghior", "Harirampur", "Manikganj Sadar", "Saturia", "Shivalaya", "Singair"] },
            { "district": "Munshiganj", "upazilas": ["Gazaria", "Lohajang", "Munshiganj Sadar", "Sirajdikhan", "Sreenagar", "Tongibari"] },
            { "district": "Narayanganj", "upazilas": ["Araihazar", "Bandar", "Narayanganj Sadar", "Rupganj", "Sonargaon"] },
            { "district": "Narsingdi", "upazilas": ["Belabo", "Monohardi", "Narsingdi Sadar", "Palash", "Raipura", "Shibpur"] },
            { "district": "Rajbari", "upazilas": ["Baliakandi", "Goalandaghat", "Pangsha", "Rajbari Sadar", "Kalukhali"] },
            { "district": "Shariatpur", "upazilas": ["Bhedarganj", "Damudya", "Gosairhat", "Naria", "Shariatpur Sadar", "Zajira"] },
            { "district": "Tangail", "upazilas": ["Gopalpur", "Basail", "Bhuapur", "Delduar", "Ghatail", "Kalihati", "Madhupur", "Mirzapur", "Nagarpur", "Sakhipur", "Dhanbari", "Tangail Sadar"] }
        ]
    },
    {
        "division": "Khulna",
        "districts": [
            { "district": "Bagerhat", "upazilas": ["Bagerhat Sadar", "Chitalmari", "Fakirhat", "Kachua", "Mollahat", "Mongla", "Morrelganj", "Rampal", "Sarankhola"] },
            { "district": "Chuadanga", "upazilas": ["Alamdanga", "Chuadanga Sadar", "Damurhuda", "Jibannagar"] },
            { "district": "Jashore", "upazilas": ["Abhaynagar", "Bagherpara", "Chaugachha", "Jhikargachha", "Keshabpur", "Jashore Sadar", "Manirampur", "Sharsha"] },
            { "district": "Jhenaidah", "upazilas": ["Harinakundu", "Jhenaidah Sadar", "Kaliganj", "Kotchandpur", "Maheshpur", "Shailkupa"] },
            { "district": "Khulna", "upazilas": ["Batiaghata", "Dacope", "Dighalia", "Dumuria", "Koyra", "Paikgachha", "Phultala", "Rupsha", "Terokhada"] },
            { "district": "Kushtia", "upazilas": ["Bheramara", "Daulatpur", "Khoksa", "Kumarkhali", "Kushtia Sadar", "Mirpur"] },
            { "district": "Magura", "upazilas": ["Magura Sadar", "Mohammadpur", "Shalikha", "Sreepur"] },
            { "district": "Meherpur", "upazilas": ["Gangni", "Meherpur Sadar", "Mujibnagar"] },
            { "district": "Narail", "upazilas": ["Kalia", "Lohagara", "Narail Sadar", "Naragati Thana"] },
            { "district": "Satkhira", "upazilas": ["Assasuni", "Debhata", "Kalaroa", "Kaliganj", "Satkhira Sadar", "Shyamnagar", "Tala"] }
        ]
    },
    {
        "division": "Mymensingh",
        "districts": [
            { "district": "Jamalpur", "upazilas": ["Baksiganj", "Dewanganj", "Islampur", "Jamalpur Sadar", "Madarganj", "Melandaha", "Sarishabari"] },
            { "district": "Mymensingh", "upazilas": ["Bhaluka", "Dhobaura", "Fulbaria", "Gaffargaon", "Gauripur", "Haluaghat", "Ishwarganj", "Mymensingh Sadar", "Muktagachha", "Nandail", "Phulpur", "Trishal", "Tara Khanda"] },
            { "district": "Netrokona", "upazilas": ["Atpara", "Barhatta", "Durgapur", "Khaliajuri", "Kalmakanda", "Kendua", "Madan", "Mohanganj", "Netrokona Sadar", "Purbadhala"] },
            { "district": "Sherpur", "upazilas": ["Jhenaigati", "Nakla", "Nalitabari", "Sherpur Sadar", "Sreebardi"] }
        ]
    },
    {
        "division": "Rajshahi",
        "districts": [
            { "district": "Bogura", "upazilas": ["Adamdighi", "Bogura Sadar", "Dhunat", "Dhupchanchia", "Gabtali", "Kahaloo", "Nandigram", "Sariakandi", "Shajahanpur", "Sherpur", "Shibganj", "Sonatala"] },
            { "district": "Joypurhat", "upazilas": ["Akkelpur", "Joypurhat Sadar", "Kalai", "Khetlal", "Panchbibi"] },
            { "district": "Naogaon", "upazilas": ["Atrai", "Badalgachhi", "Dhamoirhat", "Manda", "Mohadevpur", "Naogaon Sadar", "Niamatpur", "Patnitala", "Porsha", "Raninagar", "Sapahar"] },
            { "district": "Natore", "upazilas": ["Bagatipara", "Baraigram", "Gurudaspur", "Lalpur", "Natore Sadar", "Singra", "Naldanga"] },
            { "district": "Chapai Nawabganj", "upazilas": ["Bholahat", "Gomastapur", "Nachole", "Nawabganj Sadar", "Shibganj"] },
            { "district": "Pabna", "upazilas": ["Atgharia", "Bera", "Bhangura", "Chatmohar", "Faridpur", "Ishwardi", "Pabna Sadar", "Santhia", "Sujanagar"] },
            { "district": "Rajshahi", "upazilas": ["Bagha", "Bagmara", "Charghat", "Durgapur", "Godagari", "Mohanpur", "Paba", "Puthia", "Tanore"] },
            { "district": "Sirajganj", "upazilas": ["Belkuchi", "Chauhali", "Kamarkhanda", "Kazipur", "Raiganj", "Shahjadpur", "Sirajganj Sadar", "Tarash", "Ullahpara"] }
        ]
    },
    {
        "division": "Rangpur",
        "districts": [
            { "district": "Dinajpur", "upazilas": ["Birampur", "Birganj", "Biral", "Bochaganj", "Chirirbandar", "Phulbari", "Ghoraghat", "Hakimpur", "Kaharole", "Khansama", "Dinajpur Sadar", "Nawabganj", "Parbatipur"] },
            { "district": "Gaibandha", "upazilas": ["Fulchhari", "Gaibandha Sadar", "Gobindaganj", "Palashbari", "Sadullapur", "Sughatta", "Sundarganj"] },
            { "district": "Kurigram", "upazilas": ["Bhurungamari", "Char Rajibpur", "Chilmari", "Phulbari", "Kurigram Sadar", "Nageshwari", "Rajarhat", "Raomari", "Ulipur"] },
            { "district": "Lalmonirhat", "upazilas": ["Aditmari", "Hatibandha", "Kaliganj", "Lalmonirhat Sadar", "Patgram"] },
            { "district": "Nilphamari", "upazilas": ["Dimla", "Domar", "Jaldhaka", "Kishoreganj", "Nilphamari Sadar", "Saidpur"] },
            { "district": "Panchagarh", "upazilas": ["Atwari", "Boda", "Debiganj", "Panchagarh Sadar", "Tetulia"] },
            { "district": "Rangpur", "upazilas": ["Badarganj", "Gangachhara", "Kaunia", "Rangpur Sadar", "Mithapukur", "Pirgachha", "Pirganj", "Taraganj"] },
            { "district": "Thakurgaon", "upazilas": ["Baliadangi", "Haripur", "Pirganj", "Ranisankail", "Thakurgaon Sadar"] }
        ]
    },
    {
        "division": "Sylhet",
        "districts": [
            { "district": "Habiganj", "upazilas": ["Ajmiriganj", "Bahubal", "Baniyachong", "Chunarughat", "Habiganj Sadar", "Lakhai", "Madhabpur", "Nabiganj", "Sayestaganj"] },
            { "district": "Moulvibazar", "upazilas": ["Barlekha", "Juri", "Kamalganj", "Kulaura", "Moulvibazar Sadar", "Rajnagar", "Sreemangal"] },
            { "district": "Sunamganj", "upazilas": ["Bishwambarpur", "Chhatak", "Derai", "Dharampasha", "Dowarabazar", "Jagannathpur", "Jamalganj", "Sullah", "Sunamganj Sadar", "Tahirpur", "South Sunamganj"] },
            { "district": "Sylhet", "upazilas": ["Balaganj", "Beanibazar", "Bishwanath", "Companiesgonj", "Dakshin Surma", "Fenchuganj", "Golapganj", "Gowainghat", "Jaintiapur", "Kanaighat", "Osmani Nagar", "Sylhet Sadar", "Zakiganj"] }
        ]
    }
];

// SVG Icons
const GoogleIcon = () => ( <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor"> <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>);
const FacebookIcon = () => ( <svg className="w-5 h-5 mr-3 text-blue-600" fill="currentColor" viewBox="0 0 24 24"> <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>);
// Corrected Apple Icon
const AppleIcon = () => ( <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24"> <path d="M19.1,11.49a3.48,3.48,0,0,0-2.2-3.16,3.28,3.28,0,0,0-3.23,1.1,1.5,1.5,0,0,1-2.34,0,3.28,3.28,0,0,0-3.23-1.1A3.48,3.48,0,0,0,5.7,11.49c0,3.34,2.47,5.51,4.89,5.51,1.1,0,1.5-.66,2.41-.66s1.31.66,2.41.66c2.42,0,4.89-2.17,4.89-5.51ZM12,3.16A2.88,2.88,0,0,0,14.2,2a2.69,2.69,0,0,0-1.5-2,3.13,3.13,0,0,0-3.47,2.2A2.81,2.81,0,0,0,12,3.16Z"/></svg>);

// Reusable FormInput component
const FormInput = ({ id, name, type, label, required = false, value, onChange, isDarkMode }) => (
    <div>
        <label htmlFor={id} className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input type={type} id={id} name={name} value={value} onChange={onChange} required={required}
            className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors ${ isDarkMode ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500' }`}
        />
    </div>
);

// New Reusable FormSelect component for dropdowns
const FormSelect = ({ id, name, label, required = false, value, onChange, isDarkMode, options, placeholder, disabled = false, optionValueKey, optionLabelKey }) => (
    <div>
        <label htmlFor={id} className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <select id={id} name={name} value={value} onChange={onChange} required={required} disabled={disabled}
            className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${ isDarkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900' }`}>
            <option value="" disabled>{placeholder}</option>
            {options.map((option, index) => (
                <option key={index} value={typeof option === 'object' ? option[optionValueKey] : option}>
                    {typeof option === 'object' ? option[optionLabelKey] : option}
                </option>
            ))}
        </select>
    </div>
);

// Reusable SocialButton
const SocialButton = ({ icon, text, onClick, isDarkMode }) => (
    <button type="button" onClick={onClick}
        className={`w-full flex items-center justify-center px-4 py-3 border rounded-full font-medium transition-colors ${ isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-800' : 'border-gray-300 text-gray-700 hover:bg-gray-50' }`}>
        {icon}
        {text}
    </button>
);

const Register = () => {
    const { isDarkMode } = useDarkMode();
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        password: '',
        division: '',
        district: '',
        upazila: '',
        phone: '',
    });

    // State for dependent dropdowns
    const [availableDistricts, setAvailableDistricts] = useState([]);
    const [availableUpazilas, setAvailableUpazilas] = useState([]);

    // Effect to handle changes in division selection
    useEffect(() => {
        if (formData.division) {
            const divisionData = bangladeshData.find(div => div.division === formData.division);
            setAvailableDistricts(divisionData ? divisionData.districts : []);
            setAvailableUpazilas([]); // Reset upazilas when division changes
        } else {
            setAvailableDistricts([]);
            setAvailableUpazilas([]);
        }
    }, [formData.division]);
    
    // Effect to handle changes in district selection
    useEffect(() => {
        if (formData.district) {
            const districtData = availableDistricts.find(dist => dist.district === formData.district);
            setAvailableUpazilas(districtData ? districtData.upazilas : []);
        } else {
            setAvailableUpazilas([]);
        }
    }, [formData.district, availableDistricts]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // When division changes, reset district and upazila
        if (name === 'division') {
            setFormData(prevState => ({
                ...prevState,
                division: value,
                district: '',
                upazila: ''
            }));
        } 
        // When district changes, reset upazila
        else if (name === 'district') {
             setFormData(prevState => ({
                ...prevState,
                district: value,
                upazila: ''
            }));
        } else {
            setFormData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    
        try {
          const response = await fetch('http://localhost:3000/api/register', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(formData),
          });

          const data = await response.json();

          if (data.success) {
              alert('Registration successful!');
            // Redirect to login or dashboard
            // navigate('/signin');
          } else {
              alert(data.message || 'Registration failed');
          }
      } catch (error) {
          console.error('Registration error:', error);
          alert('Network error. Please try again.');
      }
  };
    
    const handleSocialLogin = (provider) => {
        console.log(`Continue with ${provider}`);

        // Handle social login logic here
    };

    return (
        <div className={`min-h-screen transition-colors duration-200 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            {/* Header */}
            <header className={`border-b ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link to="/" className="text-2xl font-bold text-orange-500">
                            ArtisanAura
                        </Link>
                        <Link to="/signin"
                            className={`px-4 py-2 rounded-full border transition-colors ${ isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50' }`}>
                            Sign In
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex justify-center items-center min-h-[calc(100vh-4rem)] py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div className="text-center">
                        <h2 className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            Create your account
                        </h2>
                        <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Registration is easy.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <FormInput id="email" name="email" type="email" label="Email address" required value={formData.email} onChange={handleChange} isDarkMode={isDarkMode} />
                        <FormInput id="firstName" name="firstName" type="text" label="First name" required value={formData.firstName} onChange={handleChange} isDarkMode={isDarkMode} />
                        <FormInput id="password" name="password" type="password" label="Password" required value={formData.password} onChange={handleChange} isDarkMode={isDarkMode} />
                        <FormInput id="phone" name="phone" type="tel" label="Phone number" value={formData.phone} onChange={handleChange} isDarkMode={isDarkMode} />
                        
                        {/* Division Dropdown */}
                        <FormSelect id="division" name="division" label="Division" required value={formData.division} onChange={handleChange} isDarkMode={isDarkMode}
                            options={bangladeshData} placeholder="Select your division"
                            optionValueKey="division" optionLabelKey="division" />
                        
                        {/* District Dropdown */}
                        <FormSelect id="district" name="district" label="District" required value={formData.district} onChange={handleChange} isDarkMode={isDarkMode}
                            options={availableDistricts} placeholder="Select your district"
                            disabled={!formData.division || availableDistricts.length === 0}
                            optionValueKey="district" optionLabelKey="district" />

                        {/* Upazila Dropdown */}
                        <FormSelect id="upazila" name="upazila" label="Upazila" required value={formData.upazila} onChange={handleChange} isDarkMode={isDarkMode}
                            options={availableUpazilas} placeholder="Select your upazila"
                            disabled={!formData.district || availableUpazilas.length === 0}
                            optionValueKey="upazila" optionLabelKey="upazila" />

                        <button type="submit"
                            className="w-full bg-gray-900 text-white py-3 px-4 rounded-full font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors">
                            Create Account
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className={`w-full border-t ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`} />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className={`px-2 ${isDarkMode ? 'bg-gray-900 text-gray-400' : 'bg-gray-50 text-gray-500'}`}>
                                OR
                            </span>
                        </div>
                    </div>

                    {/* Social Register Buttons */}
                    <div className="space-y-3">
                        <SocialButton icon={<GoogleIcon />} text="Continue with Google" onClick={() => handleSocialLogin('Google')} isDarkMode={isDarkMode} />
                        <SocialButton icon={<FacebookIcon />} text="Continue with Facebook" onClick={() => handleSocialLogin('Facebook')} isDarkMode={isDarkMode} />
                        <SocialButton icon={<AppleIcon />} text="Continue with Apple" onClick={() => handleSocialLogin('Apple')} isDarkMode={isDarkMode} />
                    </div>

                    {/* Terms and Privacy */}
                    <div className={`text-xs text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                         <p>
                              By clicking Register, Continue with Google, Facebook, or Apple, you agree to ArtisanAura's{' '}
                              <Link to="/terms" className="text-orange-500 hover:text-orange-600 underline">
                                   Terms of Use
                              </Link>{' '}
                              and{' '}
                              <Link to="/privacy" className="text-orange-500 hover:text-orange-600 underline">
                                   Privacy Policy
                              </Link>
                              .
                         </p>
                         <p className="mt-2">
                              We'll never post without your permission.
                         </p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Register;
