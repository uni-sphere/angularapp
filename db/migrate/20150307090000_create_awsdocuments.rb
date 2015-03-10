class CreateAwsdocuments < ActiveRecord::Migration
  def change
    create_table :awsdocuments do |t|
      t.string :name
      t.string :key
			t.string :url
      t.integer :user_id
			t.integer :node_id
			
      t.timestamps
    end
  end
end