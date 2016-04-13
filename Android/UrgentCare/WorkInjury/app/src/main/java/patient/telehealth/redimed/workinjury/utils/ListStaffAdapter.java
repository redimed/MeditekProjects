package patient.telehealth.redimed.workinjury.utils;

import android.content.Context;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import patient.telehealth.redimed.workinjury.R;
import patient.telehealth.redimed.workinjury.model.StaffModel;

/**
 * Created by phanq on 04/13/2016.
 */
public class ListStaffAdapter extends RecyclerView.Adapter<ListStaffAdapter.StaffViewHolder> {

    private final LayoutInflater inflater;
    private StaffModel[] data ;
    public ListStaffAdapter(Context context, StaffModel[] data){
       inflater = LayoutInflater.from(context);
        this.data = data;
    }

    @Override
    public StaffViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View view = inflater.inflate(R.layout.staff_item, parent, false);
        StaffViewHolder viewHolder = new StaffViewHolder(view);
        return viewHolder;
    }

    @Override
    public void onBindViewHolder(StaffViewHolder holder, int position) {
        String name = data[position].getFirstName() +" " +data[position].getLastName();
        holder.fullName.setText(name);
    }

    @Override
    public int getItemCount() {
        return data.length;
    }

    class StaffViewHolder extends RecyclerView.ViewHolder{
        TextView fullName;
        public StaffViewHolder(View itemView) {
            super(itemView);
            fullName = (TextView) itemView.findViewById(R.id.fullName);
        }
    }
}
