// Account creation page with email verification
import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../api/client';
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

// SocialButton removed

const Register = () => {
    const { isDarkMode } = useDarkMode();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        password: '',
        division: '',
        district: '',
        upazila: '',
        phone: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [passwordScore, setPasswordScore] = useState(0);

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
          setIsSubmitting(true);
          const { data } = await api.post('/register', formData);

          if (data.success) {
              navigate('/createaccount', { state: { email: formData.email } });
          } else {
              alert(data.message || 'Registration failed');
          }
      } catch (error) {
          console.error('Registration error:', error);
          alert('Request timed out or failed. Please try again.');
      } finally {
          setIsSubmitting(false);
      }
  };

    // Live password strength meter (0-5)
    useEffect(() => {
        const pwd = formData.password || '';
        let score = 0;
        if (pwd.length >= 8) score += 1;
        if (/[A-Z]/.test(pwd)) score += 1;
        if (/[a-z]/.test(pwd)) score += 1;
        if (/\d/.test(pwd)) score += 1;
        if (/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) score += 1;
        setPasswordScore(score);
    }, [formData.password]);
    
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
                <div className="w-full max-w-2xl">
                    <div className="text-center">
                        <h2 className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            Create your account
                        </h2>
                        <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Join Artisanaura in a minute. We’ll email a code to verify your address.
                        </p>
                    </div>

                    <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} mt-6 rounded-xl border shadow-lg`}> 
                      <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                          <FormInput id="email" name="email" type="email" label="Email address" required value={formData.email} onChange={handleChange} isDarkMode={isDarkMode} />
                          <FormInput id="firstName" name="firstName" type="text" label="First name" required value={formData.firstName} onChange={handleChange} isDarkMode={isDarkMode} />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          {/* Password with toggle and strength meter */}
                          <div>
                            <label htmlFor="password" className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Password</label>
                            <div className="relative">
                              <input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors ${ isDarkMode ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500' }`}
                                placeholder="Create a strong password"
                              />
                              <button type="button" onClick={() => setShowPassword(v => !v)} className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} aria-label="Toggle password visibility">
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                              </button>
                            </div>
                            <div className="mt-2">
                              <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} h-2 rounded-full overflow-hidden`}>
                                <div className={`h-full ${passwordScore <= 2 ? 'bg-red-500' : passwordScore === 3 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${(passwordScore/5)*100}%` }}></div>
                              </div>
                              <div className={`mt-1 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                Use 8+ chars with upper, lower, number, and special.
                              </div>
                            </div>
                          </div>
                          <FormInput id="phone" name="phone" type="tel" label="Phone number" value={formData.phone} onChange={handleChange} isDarkMode={isDarkMode} />
                        </div>

                        <div className="grid md:grid-cols-3 gap-4">
                          <FormSelect id="division" name="division" label="Division" required value={formData.division} onChange={handleChange} isDarkMode={isDarkMode} options={bangladeshData} placeholder="Select your division" optionValueKey="division" optionLabelKey="division" />
                          <FormSelect id="district" name="district" label="District" required value={formData.district} onChange={handleChange} isDarkMode={isDarkMode} options={availableDistricts} placeholder="Select your district" disabled={!formData.division || availableDistricts.length === 0} optionValueKey="district" optionLabelKey="district" />
                          <FormSelect id="upazila" name="upazila" label="Upazila" required value={formData.upazila} onChange={handleChange} isDarkMode={isDarkMode} options={availableUpazilas} placeholder="Select your upazila" disabled={!formData.district || availableUpazilas.length === 0} optionValueKey="upazila" optionLabelKey="upazila" />
                        </div>

                        <button type="submit" disabled={isSubmitting} className={`w-full py-3 px-4 rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''} ${isDarkMode ? 'bg-orange-600 hover:bg-orange-700 focus:ring-gray-900' : 'bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-900'}`}>
                          {isSubmitting ? 'Creating account...' : 'Create Account'}
                        </button>
                      </form>
                    </div>

                    

                    {/* Terms and Privacy */}
                    <div className={`text-xs text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                         <p>
                              By clicking Register, you agree to ArtisanAura's{' '}
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
