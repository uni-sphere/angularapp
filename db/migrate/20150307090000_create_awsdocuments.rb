class CreateAwsdocuments < ActiveRecord::Migration
  def change
    create_table :awsdocuments do |t|
      t.string :name
      t.attachment :content
      t.integer :user_id
			t.integer :node_id
      t.boolean :archived, default: false
			
      t.timestamps
    end
  end
end