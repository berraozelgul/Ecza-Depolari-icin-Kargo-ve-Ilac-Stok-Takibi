function isMockMode(){
return process.env.PAYTR_MOCK === 'true';
}

function tokenAl({merchantOid}){
    return{
        mock:true,
        token:`MOCK-${merchantOid}-${Date.now()}`,
    };
}

module.exports={isMockMode,tokenAl};