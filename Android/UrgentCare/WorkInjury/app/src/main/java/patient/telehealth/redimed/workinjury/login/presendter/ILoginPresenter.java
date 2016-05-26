package patient.telehealth.redimed.workinjury.login.presendter;

/**
 * Created by MeditekMini on 5/19/16.
 */
public interface ILoginPresenter {
    void CheckActivation(String phone);
    void Login(String verityCode);
    void GetTelehealthUser(String uid);
    void ForgetPin(String phone);
}
