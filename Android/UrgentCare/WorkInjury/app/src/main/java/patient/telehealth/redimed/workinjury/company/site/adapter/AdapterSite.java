package patient.telehealth.redimed.workinjury.company.site.adapter;

import android.content.Context;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import patient.telehealth.redimed.workinjury.R;
import patient.telehealth.redimed.workinjury.model.ModelSite;

/**
 * Created by phanq on 04/13/2016.
 */
public class AdapterSite extends RecyclerView.Adapter<AdapterSite.SiteViewHolder> {
    private LayoutInflater inflater;
    private ModelSite[] data;
    private OnClickSite onClickSite;

    public AdapterSite(Context context, ModelSite[] data, OnClickSite onClickSite) {
        inflater = LayoutInflater.from(context);
        this.data = data;
        this.onClickSite = onClickSite;
    }

    @Override
    public SiteViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View view = inflater.inflate(R.layout.site_item, parent, false);
        SiteViewHolder viewHolder = new SiteViewHolder(view);
        return viewHolder;
    }

    @Override
    public void onBindViewHolder(SiteViewHolder holder, int position) {
        ModelSite model = data[position];
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
            onClickSite.SiteItemClick(data[getAdapterPosition()].getUID());
        }
    }

    public interface OnClickSite {
        void SiteItemClick(String UID);
    }
}
