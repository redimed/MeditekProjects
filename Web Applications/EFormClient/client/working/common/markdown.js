module.exports = React.createClass({
    componentDidMount: function(){
        $(this.refs.markdown).summernote({
            height: 300,
            focus: true
        })
    },
    setValue: function(value){
        $(this.refs.markdown).code(value);
        //$(this.refs.markdown).data('markdown').setContent(value);
    },
    getValue: function(){
        return $(this.refs.markdown).code();
        //return $(this.refs.markdown).data('markdown').getContent();
        //return $(this.refs.markdown).summernote('code');
    },
	render: function(){
        return (
            <div ref="markdown"/>
        )
	}
})