package patient.telehealth.redimed.workinjury.home.presenter;

/**
 * Created by MeditekMini on 5/18/16.
 */
public interface IHomepresenter {

    void getDetailCompany();

    //CreateJsonDataSuburb : if suburb.json file not exists then create file suburb.json
    void CreateJsonDataSuburb();

    void Contact();

    boolean isLogin();

    void displayFAQs(String content);
}
