# Expense Tracker Application - Project Report

## 1. Introduction
In today's fast-paced digital world, managing personal finances has become increasingly complex. With numerous subscriptions, daily expenses, and varying sources of income, individuals often find it challenging to maintain a clear overview of their financial health. The lack of a structured tracking mechanism can lead to overspending and financial stress. To address this widespread issue, we developed the **Expense Tracker Application**, a comprehensive mobile solution designed to empower users to take control of their financial lives. This report documents the entire lifecycle of the project, from the initial ideation and planning phases through to the technology selection, development execution, and final product evaluation. 

## 2. Project Idea
The core concept behind the Expense Tracker is to provide a seamless, intuitive, and highly accessible platform for users to monitor their daily financial transactions. The primary goal is to help users understand their spending habits, adhere to monthly budgets, and ultimately achieve their financial objectives. 

The application is built around several key features:
- **Real-time Balance Tracking:** Users can view their total balance, accumulated income, and total expenses at a glance.
- **Categorized Transactions:** Every expense can be assigned to specific categories (e.g., Food, Transport, Car Loan, Shopping, House Rent) or a custom category, allowing for detailed financial analysis.
- **Visual Analytics:** A dedicated statistics dashboard provides a visual breakdown of spending using pie charts, making it easy to identify areas where costs can be reduced.
- **Customizable User Profiles:** Users can personalize their experience by selecting their preferred currency (USD, EUR, TRY, IQD, GBP, EGP) and defining a monthly spending budget.
- **Cloud Synchronization:** By utilizing a cloud-based backend, user data is securely stored and synchronized across multiple devices, ensuring that financial records are never lost.

## 3. Technology Choice
Choosing the right technology stack was crucial for the success of this project. The selection was based on criteria such as cross-platform compatibility, development speed, and real-time capabilities.

- **React Native & Expo:** We chose React Native to build the mobile application. It allows us to write a single JavaScript codebase that compiles to both iOS and Android native applications. Expo was utilized to bootstrap the project, significantly reducing setup time and providing a rich set of built-in libraries for UI components and device features.
- **Firebase Authentication:** For user security and identity management, Firebase Authentication was implemented. It provides a robust, easy-to-use authentication system that handles secure logins and user session management.
- **Firebase Firestore (NoSQL Database):** Firestore was selected as our database solution due to its real-time synchronization capabilities. As a NoSQL cloud database, it allows the application to instantly reflect newly added transactions across all user sessions without requiring manual data refreshes.
- **React Navigation:** To handle routing and screen transitions within the app, React Navigation was used. It provides a native feel to the navigation flow, including stack and tab navigators.
- **React Context API:** For global state management, we implemented the Context API (`AuthContext` and `ExpenseContext`). This approach allowed us to efficiently distribute user data and transaction lists to various screens without prop-drilling.

## 4. Planning Stage
The planning stage involved translating the project idea into actionable development steps. We began by defining the core application flow and user experience (UX) requirements.

1. **Wireframing and UI Design:** We designed the layout for five main screens: Dashboard, Add Transaction, Statistics, All Transactions, and Profile. The design philosophy focused on clean, modern aesthetics with distinct color coding (Green for Income, Red for Expenses) to enhance readability.
2. **Database Schema Design:** We structured our Firestore database into two primary collections:
   - `Users`: Storing user profiles, preferences (currency), and monthly budgets.
   - `Transactions`: Storing individual records, linked to the user via a unique ID, containing fields like `amount`, `category`, `type` (income/expense), and `date`.
3. **Architecture Planning:** We decided on a component-based architecture, separating UI components from business logic (Context providers). This separation ensures the codebase remains maintainable and scalable.

## 5. Development Stage
The development phase was executed iteratively, focusing on building a solid foundation before adding complex features.

**Step 1: Project Initialization and UI Construction**
We started by setting up the React Native project with Expo and creating the foundational UI components. Custom themes and colors were defined centrally to ensure visual consistency across the app.

**Step 2: Firebase Integration**
Firebase was integrated to handle user authentication. We built the Login and Registration screens, ensuring user credentials were securely processed.

**Step 3: Core Logic Implementation**
The heart of the application is the `AddTransactionScreen` and the `ExpenseContext`. We implemented the logic to capture user input, validate the data, and push it to Firestore. 

*Below is a code snippet demonstrating the logic used to save a transaction to the cloud:*

```javascript
  const handleSave = async () => {
    if (!amount || isNaN(parseFloat(amount))) {
      Alert.alert('Invalid Amount', 'Please enter a valid number.');
      return;
    }

    try {
      let finalCategory = category;
      if (type === 'income') {
        finalCategory = 'income';
      } else if (category === 'other') {
        finalCategory = customCategory.trim() || 'other';
      }

      await addTransaction({
        amount: parseFloat(amount),
        category: finalCategory,
        type,
        date: new Date().toISOString(),
      });
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save transaction');
    }
  };
```

**Step 4: Data Visualization and Refinement**
We integrated charting libraries to visualize the data on the Statistics screen. Real-time listeners were configured using Firestore's `onSnapshot` method to ensure the UI immediately reflects any database changes.

## 6. Final Version (App Features and Screens)
The final version of the Expense Tracker application successfully implements all planned features. Below is a detailed walkthrough of the application's interfaces:

### Dashboard Screen
The Dashboard serves as the central hub. It greets the user personally and provides an immediate financial overview. It displays the **Total Balance** prominently, accompanied by separate cards for total **Income** and **Expenses**. A "Recent Transactions" list gives users quick context on their latest financial activities.
![Dashboard Screen](Dashboard_Screenshot.jpg)
*(Note: Please insert the actual screenshot of the Dashboard screen here)*

### Add Transaction Screen
This screen provides a clean form for users to log new entries. Users can toggle between "Expense" and "Income". When "Expense" is selected, a grid of predefined categories appears. It also includes a robust validation mechanism and supports custom category creation.
![Add Transaction Screen](AddTransaction_Screenshot.jpg)
*(Note: Please insert the actual screenshot of the Add Transaction screen here)*

### Statistics Screen
To help users analyze their spending habits, the Statistics screen renders a dynamic Pie Chart. It breaks down expenses into categories like Transport, Car Loan, Shopping, and House Rent, calculating the exact distribution of the user's funds.
![Statistics Screen](Statistics_Screenshot.jpg)
*(Note: Please insert the actual screenshot of the Statistics screen here)*

### All Transactions Screen
This interface provides a comprehensive, scrollable list of all recorded transactions. Each item clearly displays the transaction type via an icon, the category name, the date, and the amount (color-coded red or green).
![All Transactions Screen](AllTransactions_Screenshot.jpg)
*(Note: Please insert the actual screenshot of the All Transactions screen here)*

### Profile Screen
The Profile screen allows users to manage their application settings. It displays the currently logged-in email. Crucially, it allows users to change their global currency preference (updating the display across the entire app) and set a targeted monthly budget. A secure Log Out button is also provided.
![Profile Screen](Profile_Screenshot.jpg)
*(Note: Please insert the actual screenshot of the Profile screen here)*

## 7. Challenges and Solutions
Throughout the development process, we encountered several technical challenges:

- **Challenge 1: Handling Asynchronous Cloud Data**
  Fetching data from Firestore initially caused UI flickering while the app waited for the network response.
  *Solution:* We implemented loading states and utilized Context API to cache the data locally. By using Firestore's `onSnapshot`, we achieved seamless real-time updates without the need to manually refresh the screens.

- **Challenge 2: Cross-Platform UI Inconsistencies**
  The keyboard on iOS would often overlap the input fields on the `AddTransactionScreen`, a problem less prominent on Android.
  *Solution:* We wrapped our input forms in React Native's `KeyboardAvoidingView` and applied platform-specific behavior (`behavior={Platform.OS === 'ios' ? 'padding' : 'height'}`) to ensure the UI dynamically adjusts when the keyboard is active.

- **Challenge 3: Global Currency State**
  Updating the currency symbol in the profile needed to instantly reflect on the Dashboard, Add Transaction, and Statistics screens.
  *Solution:* We stored the user's currency preference directly in their Firestore profile document and exposed it globally via the `AuthContext`. Whenever the user updates their profile, the Context state updates, triggering a re-render across all dependent screens.

## 8. Conclusion
The Expense Tracker application successfully fulfills its objective of providing a reliable, user-friendly tool for personal financial management. By leveraging modern mobile technologies like React Native and Firebase, we created a robust application that operates seamlessly across platforms and syncs data in real-time. The project not only solved the practical problem of tracking expenses but also served as an excellent practical application of state management, cloud database integration, and cross-platform UI design.

Future enhancements could include implementing push notifications to remind users to log daily expenses, adding the ability to export transaction data as CSV/PDF for tax purposes, and integrating a more advanced AI-driven budgeting assistant.

## 9. GitHub Information
The complete source code for this project is hosted on GitHub.
- **Repository Link:** [Insert GitHub Repository Link Here]
- **Branch:** main
- **Setup Instructions:** 
  To run the project locally, clone the repository, install dependencies using `npm install`, and start the Expo server using `npx expo start`. Ensure that the `firebaseConfig.js` file is correctly configured with your Firebase project credentials.
