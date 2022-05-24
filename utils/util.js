/*
    @param1  dob -> date of birth in format of mm/dd/yy   

    @return age in year
*/
exports.getAge = function(dob){
    const dateOfBirth = new Date(dob);
    const todayDate = new Date();
    let age = todayDate.getFullYear() - dateOfBirth.getFullYear();
    let month = todayDate.getMonth() - dateOfBirth.getMonth();
    if(month < 0 || (month === 0 && todayDate.getDate() < dateOfBirth.getDate))
        age --;
    return age;
}
