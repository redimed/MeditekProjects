package patient.telehealth.redimed.workinjury.redisite.illness.adapter;

import android.content.Context;
import android.support.v4.app.FragmentActivity;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;


import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import patient.telehealth.redimed.workinjury.MyApplication;
import patient.telehealth.redimed.workinjury.R;
import patient.telehealth.redimed.workinjury.model.EFormData;
import patient.telehealth.redimed.workinjury.model.ModelGeneral.TempDataBean;
import patient.telehealth.redimed.workinjury.utils.GridItemView;

/**
 * Created by MeditekMini on 6/15/16.
 */
public class SymptomsAdapter extends BaseAdapter {

    private Context context;
    private List<String> symptoms;
    private FragmentActivity activity;
    private ArrayList<EFormData> eFormDatas;
    private List<TempDataBean> illnessSymptoms;
    private static final String TAG = "=SYMPTOMS_ADAPTER=";

    protected MyApplication application;

    public List<Integer> selectedPositions;

    public SymptomsAdapter(Context context, FragmentActivity activity) {
        this.context = context;
        this.activity = activity;
        this.application = (MyApplication) context.getApplicationContext();

        selectedPositions = new ArrayList<>();
        illnessSymptoms = application.getIllnessSymptoms();
        //eFormDatas = application.getSelectedSymptoms();
        symptoms = new ArrayList<>(Arrays.asList(context.getResources().getStringArray(R.array.symptoms_arrays)));
        if (illnessSymptoms.size() == 0){
            application.setIllnessSymptoms(application.EformCheckbox("sym1", "row_2_7", "yes", "false", "field_2_7_0"));
            application.setIllnessSymptoms(application.EformCheckbox("sym2", "row_2_7", "yes", "false", "field_2_7_1"));
            application.setIllnessSymptoms(application.EformCheckbox("sym3", "row_2_7", "yes", "false", "field_2_7_2"));
            application.setIllnessSymptoms(application.EformCheckbox("sym4", "row_2_8", "yes", "false", "field_2_8_0"));
            application.setIllnessSymptoms(application.EformCheckbox("sym5", "row_2_8", "yes", "false", "field_2_8_1"));
            application.setIllnessSymptoms(application.EformCheckbox("sym6", "row_2_8", "yes", "false", "field_2_8_2"));
            application.setIllnessSymptoms(application.EformCheckbox("sym7", "row_2_9", "yes", "false", "field_2_9_0"));
            application.setIllnessSymptoms(application.EformCheckbox("sym8", "row_2_9", "yes", "false", "field_2_9_1"));
            application.setIllnessSymptoms(application.EformCheckbox("sym9", "row_2_9", "yes", "false", "field_2_9_2"));
            application.setIllnessSymptoms(application.EformCheckbox("sym10", "row_2_10", "yes", "false", "field_2_10_0"));
            application.setIllnessSymptoms(application.EformCheckbox("sym11", "row_2_10", "yes", "false", "field_2_10_1"));
            application.setIllnessSymptoms(application.EformCheckbox("sym12", "row_2_10", "yes", "false", "field_2_10_2"));
            application.setIllnessSymptoms(application.EformCheckbox("sym13", "row_2_11", "yes", "false", "field_2_11_0"));
            application.setIllnessSymptoms(application.EformCheckbox("sym14", "row_2_11", "yes", "false", "field_2_11_1"));
            application.setIllnessSymptoms(application.EformCheckbox("sym15", "row_2_13", "yes", "false", "field_2_13_1"));
            application.setIllnessSymptoms(application.EformCheckbox("sym16", "row_2_11", "yes", "false", "field_2_11_2"));
            application.setIllnessSymptoms(application.EformCheckbox("sym17", "row_2_12", "yes", "false", "field_2_12_0"));
            application.setIllnessSymptoms(application.EformCheckbox("sym18", "row_2_12", "yes", "false", "field_2_12_1"));
            application.setIllnessSymptoms(application.EformCheckbox("sym19", "row_2_12", "yes", "false", "field_2_12_2"));
            application.setIllnessSymptoms(application.EformCheckbox("sym20", "row_2_13", "yes", "false", "field_2_13_0"));
        }
    }

    @Override
    public int getCount() {
        return symptoms.size();
    }

    @Override
    public Object getItem(int position) {
        return symptoms.get(position);
    }

    @Override
    public long getItemId(int position) {
        return position;
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        GridItemView symptomsAdapter = (convertView == null) ? new GridItemView(activity) : (GridItemView) convertView;
        if (illnessSymptoms.get(position).getChecked().equalsIgnoreCase("true")) {
            selectedPositions.add(position);
            symptomsAdapter.display(symptoms.get(position), true);
        } else {
            symptomsAdapter.display(symptoms.get(position), false);
        }
        return symptomsAdapter;
    }
}
