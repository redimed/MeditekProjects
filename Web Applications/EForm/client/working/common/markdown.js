module.exports = React.createClass({
    componentDidMount: function(){
        $(this.refs.markdown).markdown({
            
        })
    },
    setValue: function(value){
        $(this.refs.markdown).data('markdown').setContent(value);
    },
    getValue: function(){
        return $(this.refs.markdown).data('markdown').getContent();
    },
	render: function(){
        return (
            <textarea ref="markdown"/>
        )
	}
})