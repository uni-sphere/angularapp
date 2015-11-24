class AddPositionToAwsdocuments < ActiveRecord::Migration
  def change
    add_column :awsdocuments, :position, :integer
  end
end