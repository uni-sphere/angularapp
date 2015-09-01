class AddOwnerToAwsdocuments < ActiveRecord::Migration
  def change
    add_column :awsdocuments, :owner, :string
  end
end