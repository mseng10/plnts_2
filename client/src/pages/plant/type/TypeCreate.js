// import React, { useState } from 'react';
// import Box from '@mui/material/Box';
// import {useNavigate} from "react-router-dom" 
// import { FormButton, FormTextInput, AutoCompleteInput, TextAreaInput } from '../../../elements/Form';
// import { useSpecies, useGeneraTypes } from '../../../hooks/usePlants';
// import { ServerError, Loading } from '../../../elements/Page';

// /** Create a new plant type of a specified genus. */
// const TypeCreate = () => {
//   // Fields
//   const [name, setName] = useState('');
//   const [commonName, setCommonName] = useState('');
//   const [description, setDescription] = useState('');
//   const [genus, setGenus] = useState(null);

//   const { createSpecies } = useSpecies();
//   const { isLoading, error, genera} = useGeneraTypes();

//   // Navigation
//   const navigate = useNavigate();

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     const newSpecies = {
//       name,
//       common_name: commonName,
//       description,
//       genus_id: genus.id
//     };

//     try {
//       await createSpecies(newSpecies);
//       navigate("/");
//     } catch (error) {
//       console.error('Error adding new type:', error);
//     }
//   };

//   const handleCancel = () => {
//     navigate("/");
//   };

//   if (isLoading) return <Loading/>;
//   if (error) return <ServerError/>;
  
//   return (
//     <Box sx={{ height: '100%', width: '100%' }}>
//       <Box sx={{ width: 600, bgcolor: 'background.paper', borderRadius: 2 }}>
//         <form onSubmit={handleSubmit}>
//           <FormButton
//             icon="type"
//             color="type"
//             handleCancel={handleCancel}
//           />
//           <div className='right'>
//             <FormTextInput
//               label={"Name"}
//               value={name}
//               color={"type"}
//               setValue={setName}
//             />
//             <FormTextInput
//               label={"Common Name"}
//               value={commonName}
//               color={"type"}
//               setValue={setCommonName}
//             />
//             <AutoCompleteInput
//               label="Genus"
//               color="type"
//               value={genus}
//               options={genera}
//               setValue={setGenus}
//             />
//             <TextAreaInput
//               label="Description"
//               value={description}
//               color="type"
//               setValue={setDescription}
//             />
//           </div>
//         </form>
//       </Box>
//     </Box>
//   );
// };

// export default TypeCreate;


