// import React, { useState, useEffect, useCallback } from 'react';
// import { createAvatar } from '@dicebear/core';
// import * as avataaarsStyle from '@dicebear/avataaars';
// // Importar el tipo Options para evitar errores de tipo
// type AvatarStyleOptions = any; // Usamos any temporalmente para evitar errores de tipo

// interface AvatarCreatorProps {
//   onAvatarCreated: (avatarUrl: string) => void;
//   onClose: () => void;
// }

// const AvatarCreator: React.FC<AvatarCreatorProps> = ({ onAvatarCreated, onClose }) => {
//   const [seed, setSeed] = useState<string>('custom-avatar');
//   // Estado para las opciones del avatar
//   const [avatarOptions, setAvatarOptions] = useState({
//     skinColor: 'light',
//     top: 'shortHairShortFlat',
//     hairColor: 'black',
//     facialHair: 'blank',
//     clothing: 'blazerShirt',
//     eyes: 'default',
//     eyebrows: 'default',
//     mouth: 'default',
//     accessories: 'blank',
//   });
//   const [avatarUrl, setAvatarUrl] = useState<string>('');
//   const [loading, setLoading] = useState<boolean>(true);

//   // Opciones disponibles para cada característica
//   const options = {
//     skinColor: ['amber', 'black', 'light', 'pale', 'tanned', 'yellow'],
//     top: [
//       'noHair', 'eyepatch', 'hat', 'hijab', 'turban', 'winterHat1', 'winterHat2', 'winterHat3', 'winterHat4',
//       'longHairBigHair', 'longHairBob', 'longHairBun', 'longHairCurly', 'longHairCurvy', 'longHairDreads',
//       'longHairFrida', 'longHairFro', 'longHairFroBand', 'longHairNotTooLong', 'longHairShavedSides',
//       'longHairMiaWallace', 'longHairStraight', 'longHairStraight2', 'longHairStraightStrand',
//       'shortHairDreads01', 'shortHairDreads02', 'shortHairFrizzle', 'shortHairShaggyMullet',
//       'shortHairShortCurly', 'shortHairShortFlat', 'shortHairShortRound', 'shortHairShortWaved',
//       'shortHairSides', 'shortHairTheCaesar', 'shortHairTheCaesarSidePart'
//     ],
//     hairColor: ['auburn', 'black', 'blonde', 'blondeGolden', 'brown', 'brownDark', 'pastelPink', 'platinum', 'red', 'silverGray'],
//     facialHair: ['blank', 'beardMedium', 'beardLight', 'beardMajestic', 'moustacheFancy', 'moustacheMagnum'],
//     clothing: [
//       'blazerShirt', 'blazerSweater', 'collarSweater', 'graphicShirt', 'hoodie', 'overall',
//       'shirtCrewNeck', 'shirtScoopNeck', 'shirtVNeck'
//     ],
//     eyes: [
//       'close', 'cry', 'default', 'dizzy', 'eyeRoll', 'happy', 'hearts', 'side', 'squint', 'surprised', 'wink', 'winkWacky'
//     ],
//     eyebrows: [
//       'angry', 'angryNatural', 'default', 'defaultNatural', 'flatNatural', 'raisedExcited',
//       'raisedExcitedNatural', 'sadConcerned', 'sadConcernedNatural', 'unibrowNatural', 'upDown', 'upDownNatural'
//     ],
//     mouth: [
//       'concerned', 'default', 'disbelief', 'eating', 'grimace', 'sad', 'screamOpen', 'serious',
//       'smile', 'tongue', 'twinkle', 'vomit'
//     ],
//     accessories: ['blank', 'kurt', 'prescription01', 'prescription02', 'round', 'sunglasses', 'wayfarers'],
//   };



//   const generateAvatar = useCallback(async () => {
//     try {
//       setLoading(true);
//       console.log('Generating avatar with options:', avatarOptions);
      
//       // Crear el avatar con las opciones como objeto
//       const avatarOptions2: AvatarStyleOptions = {
//         seed,
//         backgroundColor: undefined,
//         radius: 50,
//         size: 200,
//         scale: 80,
//         translateY: 10,
//         flip: false,
//       };
      
//       // Añadir las opciones específicas del avatar como arrays
//       if (avatarOptions.skinColor) avatarOptions2.skinColor = [avatarOptions.skinColor];
//       if (avatarOptions.top) avatarOptions2.top = [avatarOptions.top];
//       if (avatarOptions.hairColor) avatarOptions2.hairColor = [avatarOptions.hairColor];
//       if (avatarOptions.facialHair) avatarOptions2.facialHair = [avatarOptions.facialHair];
//       if (avatarOptions.hairColor) avatarOptions2.facialHairColor = [avatarOptions.hairColor];
//       if (avatarOptions.clothing) avatarOptions2.clothing = [avatarOptions.clothing];
//       if (avatarOptions.eyes) avatarOptions2.eyes = [avatarOptions.eyes];
//       if (avatarOptions.eyebrows) avatarOptions2.eyebrows = [avatarOptions.eyebrows];
//       if (avatarOptions.mouth) avatarOptions2.mouth = [avatarOptions.mouth];
//       if (avatarOptions.accessories) avatarOptions2.accessories = [avatarOptions.accessories];

//       console.log('Formatted options for DiceBear:', avatarOptions2);
      
//       const avatar = createAvatar(avataaarsStyle, avatarOptions2);

//       const dataUrl = await avatar.toDataUri();
//       setAvatarUrl(dataUrl);
//     } catch (error) {
//       console.error('Error generating avatar:', error);
//     } finally {
//       setLoading(false);
//     }
//   }, [avatarOptions, seed]);

//   useEffect(() => {
//     generateAvatar();
//   }, [generateAvatar]);



//   const handleOptionChange = (category: string, value: string) => {
//     console.log(`Changing ${category} to ${value}`);
//     setAvatarOptions(prev => {
//       // Validar que el valor sea válido para la categoría
//       if (options[category as keyof typeof options].includes(value)) {
//         return {
//           ...prev,
//           [category]: value
//         };
//       }
//       console.error(`Invalid value ${value} for category ${category}`);
//       return prev;
//     });
//   };

//   const handleRandomize = () => {
//     // Generar un seed aleatorio
//     const randomSeed = Math.random().toString(36).substring(2, 10);
//     setSeed(randomSeed);
    
//     // También cambiar opciones aleatorias
//     const randomOptions = {
//       skinColor: options.skinColor[Math.floor(Math.random() * options.skinColor.length)],
//       top: options.top[Math.floor(Math.random() * options.top.length)],
//       hairColor: options.hairColor[Math.floor(Math.random() * options.hairColor.length)],
//       facialHair: options.facialHair[Math.floor(Math.random() * options.facialHair.length)],
//       clothing: options.clothing[Math.floor(Math.random() * options.clothing.length)],
//       eyes: options.eyes[Math.floor(Math.random() * options.eyes.length)],
//       eyebrows: options.eyebrows[Math.floor(Math.random() * options.eyebrows.length)],
//       mouth: options.mouth[Math.floor(Math.random() * options.mouth.length)],
//       accessories: options.accessories[Math.floor(Math.random() * options.accessories.length)],
//     };
//     setAvatarOptions(randomOptions);
//   };

//   const handleSave = () => {
//     onAvatarCreated(avatarUrl);
//     onClose();
//   };

//   return (
//     <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
//       <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Create Your Avatar</h2>
//           <button 
//             onClick={onClose}
//             className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
//           >
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </button>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {/* Preview */}
//           <div className="md:col-span-1 flex flex-col items-center">
//             <div className="w-48 h-48 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 mb-4 flex items-center justify-center">
//               {loading ? (
//                 <div className="text-gray-500 dark:text-gray-400 animate-pulse">Cargando...</div>
//               ) : (
//                 <img src={avatarUrl} alt="Avatar Preview" className="w-full h-full" />
//               )}
//             </div>
//             <button 
//               onClick={handleRandomize}
//               className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 mb-2"
//             >
//               Randomize
//             </button>
//             <button 
//               onClick={handleSave}
//               className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
//             >
//               Save Avatar
//             </button>
//           </div>

//           {/* Options */}
//           <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
//             {Object.entries(options).map(([category, values]) => (
//               <div key={category} className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 capitalize">
//                   {category.replace(/([A-Z])/g, ' $1').trim()}
//                 </label>
//                 <select
//                   value={avatarOptions[category as keyof typeof avatarOptions]}
//                   onChange={(e) => handleOptionChange(category, e.target.value)}
//                   className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
//                 >
//                   {values.map((value: string) => (
//                     <option key={value} value={value}>
//                       {value.replace(/([A-Z])/g, ' $1').trim()}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AvatarCreator;


// import React, { useEffect, useState, useCallback } from 'react';
// import { createAvatar } from '@dicebear/core';
// import * as micah from '@dicebear/micah';

// interface AvatarCreatorProps {
//   onAvatarCreated: (avatarUrl: string) => void;
//   onClose: () => void;
// }

// const AvatarCreator: React.FC<AvatarCreatorProps> = ({ onAvatarCreated, onClose }) => {
//   const [seed, setSeed] = useState('custom-seed');
//   const [options, setOptions] = useState({
//     skinColor: 'light',
//     hair: 'fonze',
//     hairColor: 'black',
//     accessories: 'glasses',
//     shirtColor: 'blue',
//   });
//   const [avatarUrl, setAvatarUrl] = useState('');
//   const [loading, setLoading] = useState(true);

//   const availableOptions = {
//     skinColor: ['light', 'yellow', 'brown', 'darkBrown'],
//     hair: ['fonze', 'mrT', 'dougFunny', 'mrClean', 'dannyPhantom', 'full', 'turban', 'pixie'],
//     hairColor: ['black', 'brown', 'blonde', 'red'],
//     accessories: ['none', 'glasses', 'hat'],
//     shirtColor: ['blue', 'green', 'red', 'purple'],
//   };

//   const generateAvatar = useCallback(async () => {
//     setLoading(true);
//     try {
//       const avatar = createAvatar(micah, {
//         seed,
//         skinColor: [options.skinColor],
//         hair: [options.hair],
//         hairColor: [options.hairColor],
//         accessories: [options.accessories],
//         shirtColor: [options.shirtColor],
//         backgroundColor: ['transparent'],
//       });

//       const dataUri = await avatar.toDataUri();
//       setAvatarUrl(dataUri);
//     } catch (err) {
//       console.error('Error generating avatar:', err);
//     } finally {
//       setLoading(false);
//     }
//   }, [options, seed]);

//   useEffect(() => {
//     generateAvatar();
//   }, [generateAvatar]);

//   const handleChange = (key: keyof typeof options, value: string) => {
//     setOptions(prev => ({ ...prev, [key]: value }));
//   };

//   return (
//     <div className="p-4 bg-white rounded shadow max-w-xl mx-auto">
//       <h2 className="text-xl font-bold mb-4">Customize Avatar</h2>

//       <div className="flex items-center justify-center mb-4">
//         {loading ? <div>Cargando...</div> : <img src={avatarUrl} alt="Avatar" className="w-32 h-32" />}
//       </div>

//       <div className="grid grid-cols-2 gap-4 mb-4">
//         {Object.entries(availableOptions).map(([key, values]) => (
//           <div key={key}>
//             <label className="block text-sm font-medium capitalize">{key}</label>
//             <select
//               className="w-full mt-1 p-2 border rounded"
//               value={options[key as keyof typeof options]}
//               onChange={(e) => handleChange(key as keyof typeof options, e.target.value)}
//             >
//               {values.map(opt => (
//                 <option key={opt} value={opt}>{opt}</option>
//               ))}
//             </select>
//           </div>
//         ))}
//       </div>

//       <div className="flex justify-between">
//         <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">Cancelar</button>
//         <button onClick={() => onAvatarCreated(avatarUrl)} className="bg-blue-500 text-white px-4 py-2 rounded">Guardar</button>
//       </div>
//     </div>
//   );
// };

// export default AvatarCreator;
