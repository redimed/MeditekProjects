package patient.telehealth.redimed.workinjury.utils;

import android.content.Context;
import android.content.Intent;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import patient.telehealth.redimed.workinjury.CompanyActivity;
import patient.telehealth.redimed.workinjury.R;
import patient.telehealth.redimed.workinjury.WorkActivity;
import patient.telehealth.redimed.workinjury.model.SiteModel;

/**
 * Created by phanq on 04/13/2016.
 */
public class ListSiteAdapter extends RecyclerView.Adapter<ListSiteAdapter.SiteViewHolder> {
    private LayoutInflater inflater;
    private SiteModel[] data;
    private Context context;
    private boolean work;

    public ListSiteAdapter(Context context,SiteModel[] data, boolean work) {
        inflater = LayoutInflater.from(context);
        this.context = context;
        this.data = data;
        this.work = work;
    }

    @Override
    public SiteViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View view = inflater.inflate(R.layout.site_item, parent, false);
        SiteViewHolder viewHolder = new SiteViewHolder(view);
        return viewHolder;
    }

    @Override
    public void onBindViewHolder(SiteViewHolder holder, int position) {
        SiteModel model = data[position];
        holder.siteName.setText(model.getSiteName());
    }

    @Override
    public int getItemCount() {
        return data.length;
    }

    public class SiteViewHolder extends RecyclerView.ViewHolder implements View.OnClickListener {
        TextView siteName;
        public SiteViewHolder(View itemView) {
            super(itemView);
            siteName = (TextView) itemView.findViewById(R.id.siteName);
            itemView.setClickable(true);
            itemView.setOnClickListener(this);
        }

        @Override
        public void onClick(View v) {
            if (work){
                Intent intent = new Intent(context, WorkActivity.class);
                intent.putExtra("site", data[getAdapterPosition()]);
                intent.setFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP | Intent.FLAG_ACTIVITY_CLEAR_TOP);
                Log.d("getContactName",data[getAdapterPosition()].getContactName()+"");
                context.startActivity(intent);
            }else {
                Intent intent = new Intent(context, CompanyActivity.class);
                intent.putExtra("site", data[getAdapterPosition()]);
                context.startActivity(intent);
            }
        }
    }
}
