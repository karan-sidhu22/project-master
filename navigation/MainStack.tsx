// // navigation/MainStack.tsx
// import React from 'react';
// import { createStackNavigator } from '@react-navigation/stack';
// import HomeScreen from '../components/HomeScreen';
// import IncomeScreen from '../components/IncomeScreen'; 
// import GraphsScreen from '../components/GraphsScreen'; 
// import AccountScreen from '../components/AccountScreen';

// const Stack = createStackNavigator();

// export default function MainStack() {
//     return (
//         <Stack.Navigator initialRouteName="Home">
//             <Stack.Screen
//                 name="Home"
//                 component={HomeScreen}
//                 options={{ title:'Expenses', headerLeft: ()=> null }}
//             />
//             <Stack.Screen
//                 name="Income"
//                 component={IncomeScreen}
//                 options={{ title: 'Income', headerLeft: ()=> null }}
//             />
//             <Stack.Screen
//                 name="Graphs"
//                 component={GraphsScreen}
//                 options={{ title: 'Graphs', headerLeft: ()=> null }}
//             />
//             <Stack.Screen
//                 name="Account"
//                 component={AccountScreen}
//                 options={{ title: 'Account', headerLeft: ()=> null }}
//             />
//         </Stack.Navigator>
//     );
// }