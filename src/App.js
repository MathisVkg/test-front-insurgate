import React, { useEffect, useState } from "react";
import "./App.css";
import { apiService } from "./api.service";

function App() {
  const [companyInfo, setCompanyInfo] = useState({});
  const [errorFrom, setErrorForm] = useState(false);
  const [errorService, setErrorService] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (errorFrom || errorService) {
      setTimeout(() => {
        setErrorForm(false);
        setErrorService(false);
      }, 2000);
    }
  }, [errorFrom, errorService]);

  const submitValue = (e, target) => {
    e.preventDefault();
    if (target.tvaNumber?.value) {
      setIsLoading(true);
      getInformationByTva(target.tvaNumber?.value);
    } else setErrorForm(true);
  };

  const getInformationByTva = (tvaNumber) => {
    apiService.getInformationByTva(tvaNumber).then(
      (result) => {
        console.log(result.company);
        setCompanyInfo(result.company);
        setIsLoading(false);
      },
      () => setErrorService(true)
    );
  };

  const resetForm = () => {
    document.getElementById("form-container").reset();
  };

  return (
    <div className="App">
      <div className="form-container">
        <form onSubmit={(e) => submitValue(e, e.target)} id="form-container">
          <div>
            <p className="description">
              Chercher des informations à propos d'une entreprise en introduisant le numéro de TVA
            </p>
            <label>Numéro de TVA</label>
            <div className="input-container">
              <input type="text" name="tvaNumber" />
              <i className="fa-solid fa-xmark" onClick={resetForm} />
            </div>
          </div>
          <button type="submit">Rechercher</button>
          {errorFrom && <p className="error">Vous devez entrer un numéro de TVA valide !</p>}
          {errorService && <p className="error">Une erreur est survenue, veuillez recommencer.</p>}
        </form>
      </div>
      <div className={`information-container ${!(Object.entries(companyInfo).length > 0) && "empty-container"}`}>
        {Object.entries(companyInfo).length > 0 ? (
          isLoading ? (
            <i className="fa-solid fa-spinner spinner-animation" />
          ) : (
            <div className="global-container">
              <div className="left-container">
                <div className="company-name">
                  <p className="name">
                    {companyInfo?.company_name} <span>({companyInfo?.language})</span>
                  </p>
                  <p className="info">
                    Numéro de TVA:{" "}
                    <span>{companyInfo?.identifier ? companyInfo?.identifier : "Aucune capital renseigné"}</span>
                  </p>
                  <p className="info">
                    Capital: <span>{companyInfo?.financial_meta?.capital}€</span>
                  </p>
                </div>
                <div className="company-adresse">
                  <h4>
                    <i className="fa-solid fa-address-book" /> Adresse
                  </h4>
                  <p>
                    {companyInfo?.addresses && companyInfo?.addresses[0]?.street !== null
                      ? companyInfo?.addresses[0]?.full_address
                      : "Aucune adresse renseigné"}
                  </p>
                </div>
                <div className="juridical-container">
                  <h4>
                    <i className="fa-solid fa-gavel" />
                    Formes juridiques
                  </h4>
                  <p>
                    FR:{" "}
                    {companyInfo?.juridical_form?.fr ? (
                      <span>
                        {companyInfo?.juridical_form?.fr?.label} {`(${companyInfo?.juridical_form?.fr?.short})`}
                      </span>
                    ) : (
                      "Aucune donnée renseigné"
                    )}
                  </p>
                  <p>
                    NL:{" "}
                    {companyInfo?.juridical_form?.nl ? (
                      <span>
                        {companyInfo?.juridical_form?.nl?.label} {`(${companyInfo?.juridical_form?.nl?.short})`}
                      </span>
                    ) : (
                      "Aucune donnée renseigné"
                    )}
                  </p>
                  <p>
                    DE:{" "}
                    {companyInfo?.juridical_form?.de ? (
                      <span>
                        {companyInfo?.juridical_form?.de?.label} {`(${companyInfo?.juridical_form?.de?.short})`}
                      </span>
                    ) : (
                      "Aucune donnée renseigné"
                    )}
                  </p>
                </div>
              </div>
              <div className="right-container">
                <h2>Activitées de l'entreprise</h2>
                <div className="company-activities">
                  {companyInfo?.activities?.map(({ label: { fr }, start_date }, index) => (
                    <div className="company-activity-card" key={index}>
                      <p className="date">
                        <i className="fa-solid fa-calendar" />
                        {start_date}
                      </p>
                      <p className="label">{fr?.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        ) : (
          <p>
            <i className="fa-solid fa-file" /> Aucune information trouvée
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
