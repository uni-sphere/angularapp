class CreateNodes < ActiveRecord::Migration
  def change
    create_table :nodes do |t|
      t.string :name
      t.integer :parent_id
      t.integer :organization_id
      t.integer :user_id
			
      t.timestamps
    end
  end
end